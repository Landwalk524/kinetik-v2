// Jikan v4 — MyAnimeList unofficial REST API
// Docs: https://docs.api.jikan.moe
// Rate limit: ~3 requests/second, no auth needed

const BASE = 'https://api.jikan.moe/v4';

// Simple in-memory cache (5 min TTL)
const cache = new Map();
const TTL = 5 * 60 * 1000;

async function get(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const key = path + (query ? '?' + query : '');

  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const res = await fetch(`${BASE}${key}`);
  if (!res.ok) throw new Error(`Jikan ${res.status}: ${path}`);
  const json = await res.json();
  const data = json.data ?? json;
  cache.set(key, { data, ts: Date.now() });
  return data;
}

// ─── Anime Info ───────────────────────────────────────────────────────────────

/** Full anime details by MAL ID */
export async function getAnimeById(malId) {
  return get(`/anime/${malId}/full`);
}

/** Episode list for an anime (paginated, ~100/page) */
export async function getEpisodes(malId, page = 1) {
  return get(`/anime/${malId}/episodes`, { page });
}

// ─── Discovery ────────────────────────────────────────────────────────────────

/** Currently airing anime */
export async function getAiring(limit = 20) {
  return get('/top/anime', { filter: 'airing', limit });
}

/** All-time top anime */
export async function getTopAnime(limit = 20) {
  return get('/top/anime', { filter: 'bypopularity', limit });
}

/** Current season */
export async function getSeasonNow(limit = 24) {
  const raw = await get('/seasons/now', { limit });
  return Array.isArray(raw) ? raw : (raw?.data ?? []);
}

/** Upcoming season */
export async function getUpcoming(limit = 12) {
  return get('/top/anime', { filter: 'upcoming', limit });
}

/** Homepage bundle — runs 4 queries in parallel */
export async function getHomepageData() {
  const [airing, popular, seasonal, upcoming] = await Promise.all([
    getAiring(16),
    getTopAnime(10),
    getSeasonNow(16),
    getUpcoming(12),
  ]);
  return { airing, popular, seasonal, upcoming };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchAnime(query, limit = 24) {
  return get('/anime', { q: query, limit, type: 'tv', order_by: 'popularity', sort: 'asc' });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get the large cover image URL from a Jikan anime object */
export function getCover(anime) {
  return (
    anime?.images?.jpg?.large_image_url ||
    anime?.images?.jpg?.image_url ||
    anime?.images?.webp?.large_image_url ||
    ''
  );
}

/** Get display title (prefer English) */
export function getTitle(anime) {
  return anime?.title_english || anime?.title || '';
}

/** Convert Jikan anime object to a slug for gogoanime-style URLs */
export function toSlug(anime) {
  return getTitle(anime)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
