const ANILIST_URL = 'https://graphql.anilist.co';

// In-memory cache with TTL (5 minutes)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function cachedFetch(key, fetchFn) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }
  const data = await fetchFn();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

async function gql(query, variables = {}) {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  return json.data;
}

const MEDIA_FIELDS = `
  id
  title { romaji english }
  episodes
  status
  coverImage { large }
  averageScore
  genres
`;

const MEDIA_FIELDS_FULL = `
  id
  title { romaji english }
  episodes
  status
  coverImage { large extraLarge }
  bannerImage
  description
  genres
  averageScore
  season
  seasonYear
  studios { nodes { name } }
`;

export async function getTrendingAnime() {
  return cachedFetch('trending', async () => {
    const data = await gql(`
      query {
        Page(page: 1, perPage: 20) {
          media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) { ${MEDIA_FIELDS} }
        }
      }
    `);
    return data.Page.media;
  });
}

export async function getPopularAnime() {
  return cachedFetch('popular', async () => {
    const data = await gql(`
      query {
        Page(page: 1, perPage: 20) {
          media(type: ANIME, sort: POPULARITY_DESC) { ${MEDIA_FIELDS} }
        }
      }
    `);
    return data.Page.media;
  });
}

export async function getSeasonalAnime() {
  return cachedFetch('seasonal', async () => {
    const data = await gql(`
      query {
        Page(page: 1, perPage: 20) {
          media(type: ANIME, sort: POPULARITY_DESC, season: SPRING, seasonYear: 2026) { ${MEDIA_FIELDS} }
        }
      }
    `);
    return data.Page.media;
  });
}

export async function searchAnime(query) {
  return cachedFetch(`search:${query}`, async () => {
    const data = await gql(`
      query ($search: String) {
        Page(page: 1, perPage: 20) {
          media(search: $search, type: ANIME, sort: POPULARITY_DESC) { ${MEDIA_FIELDS} }
        }
      }
    `, { search: query });
    return data.Page.media;
  });
}

export async function getAnimeById(id) {
  return cachedFetch(`anime:${id}`, async () => {
    const data = await gql(`
      query ($id: Int) {
        Media(id: $id, type: ANIME) { ${MEDIA_FIELDS_FULL} }
      }
    `, { id });
    return data.Media;
  });
}

// Batch fetch all homepage data in ONE request
export async function getHomepageData() {
  return cachedFetch('homepage', async () => {
    const data = await gql(`
      query {
        trending: Page(page: 1, perPage: 20) {
          media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) { ${MEDIA_FIELDS} }
        }
        popular: Page(page: 1, perPage: 20) {
          media(type: ANIME, sort: POPULARITY_DESC) { ${MEDIA_FIELDS} }
        }
        seasonal: Page(page: 1, perPage: 20) {
          media(type: ANIME, sort: POPULARITY_DESC, season: SPRING, seasonYear: 2026) { ${MEDIA_FIELDS} }
        }
      }
    `);

    // Warm individual caches too so anime page loads are instant
    [...data.trending.media, ...data.popular.media, ...data.seasonal.media].forEach((anime) => {
      if (!cache.has(`anime:${anime.id}`)) {
        cache.set(`anime:${anime.id}`, { data: anime, ts: Date.now() });
      }
    });

    return {
      trending: data.trending.media,
      popular: data.popular.media,
      seasonal: data.seasonal.media,
    };
  });
}

// Prefetch an anime detail page in the background (call on hover)
export function prefetchAnime(id) {
  if (!cache.has(`anime:${id}`)) {
    getAnimeById(id);
  }
}

export function toSlug(title) {
  return (title?.english || title?.romaji || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
