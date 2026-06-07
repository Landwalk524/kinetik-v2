// Jikan v4 — MyAnimeList unofficial REST API
// Docs: https://docs.api.jikan.moe
// Rate limit: ~3 req/second — DO NOT fire parallel requests

const BASE = 'https://api.jikan.moe/v4';

// In-memory cache (10 min TTL)
const cache = new Map();
const TTL = 10 * 60 * 1000;

// Sequential request queue to avoid 429s
let requestQueue = Promise.resolve();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function get(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const key = path + (query ? '?' + query : '');

  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  // Chain onto the queue — enforces ~400ms between requests
  const result = await (requestQueue = requestQueue.then(async () => {
    await sleep(400);
    const res = await fetch(`${BASE}${path}${query ? '?' + query : ''}`);
    if (!res.ok) {
      if (res.status === 429) {
        // Back off and retry once
        await sleep(2000);
        const retry = await fetch(`${BASE}${path}${query ? '?' + query : ''}`);
        if (!retry.ok) throw new Error(`Jikan ${retry.status}: ${path}`);
        const json = await retry.json();
        return json.data ?? json;
      }
      throw new Error(`Jikan ${res.status}: ${path}`);
    }
    const json = await res.json();
    return json.data ?? json;
  }));

  cache.set(key, { data: result, ts: Date.now() });
  return result;
}

// ─── Anime Info ───────────────────────────────────────────────────────────────

export async function getAnimeById(malId) {
  return get(`/anime/${malId}/full`);
}

export async function getEpisodes(malId, page = 1) {
  return get(`/anime/${malId}/episodes`, { page });
}

// ─── Discovery ────────────────────────────────────────────────────────────────

export async function getAiring(limit = 18) {
  return get('/top/anime', { filter: 'airing', limit });
}

export async function getTopAnime(limit = 10) {
  return get('/top/anime', { filter: 'bypopularity', limit });
}

export async function getSeasonNow(limit = 18) {
  const raw = await get('/seasons/now', { limit });
  return Array.isArray(raw) ? raw : (raw?.data ?? []);
}

export async function getUpcoming(limit = 12) {
  return get('/top/anime', { filter: 'upcoming', limit });
}

/**
 * Homepage bundle — SEQUENTIAL to avoid Jikan 429 rate limits.
 * Fires one request at a time with ~400ms gap.
 */
export async function getHomepageData() {
  const airing = await getAiring(18);
  const popular = await getTopAnime(10);
  const seasonal = await getSeasonNow(18);
  const upcoming = await getUpcoming(12);
  return { airing, popular, seasonal, upcoming };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchAnime(query, limit = 24) {
  return get('/anime', { q: query, limit, type: 'tv', order_by: 'popularity', sort: 'asc' });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCover(anime) {
  return (
    anime?.images?.jpg?.large_image_url ||
    anime?.images?.jpg?.image_url ||
    anime?.images?.webp?.large_image_url ||
    ''
  );
}

export function getTitle(anime) {
  return anime?.title_english || anime?.title || '';
}

export function toSlug(anime) {
  return getTitle(anime)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
