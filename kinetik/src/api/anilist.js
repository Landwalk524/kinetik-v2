const ANILIST_URL = 'https://graphql.anilist.co';

// In-memory cache with 5-minute TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function cachedFetch(key, fetchFn) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
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

const CARD_FIELDS = `
  id title { romaji english } episodes status
  coverImage { large medium } averageScore genres
  format nextAiringEpisode { episode }
`;

const HERO_FIELDS = `
  id title { romaji english } episodes status description
  coverImage { large extraLarge } bannerImage averageScore genres
  startDate { year month day } endDate { year month day }
  format nextAiringEpisode { episode }
`;

export async function getHomepageData() {
  return cachedFetch('homepage', async () => {
    const data = await gql(`
      query {
        hero: Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) { ${HERO_FIELDS} }
        }
        latest: Page(page: 1, perPage: 12) {
          media(type: ANIME, sort: UPDATED_AT_DESC, status: RELEASING) { ${CARD_FIELDS} }
        }
        latestSub: Page(page: 1, perPage: 12) {
          media(type: ANIME, sort: UPDATED_AT_DESC, status: RELEASING, isAdult: false) { ${CARD_FIELDS} }
        }
        latestDub: Page(page: 1, perPage: 12) {
          media(type: ANIME, sort: POPULARITY_DESC, status: RELEASING) { ${CARD_FIELDS} }
        }
        upcoming: Page(page: 1, perPage: 12) {
          media(type: ANIME, sort: START_DATE, status: NOT_YET_RELEASED) { ${CARD_FIELDS} }
        }
        newRelease: Page(page: 1, perPage: 5) {
          media(type: ANIME, sort: START_DATE_DESC) { ${CARD_FIELDS} }
        }
        topDay: Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) { ${CARD_FIELDS} }
        }
        topWeek: Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: POPULARITY_DESC, status: RELEASING) { ${CARD_FIELDS} }
        }
        topMonth: Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: SCORE_DESC) { ${CARD_FIELDS} }
        }
      }
    `);

    return {
      hero: data.hero.media,
      latest: { all: data.latest.media, sub: data.latestSub.media, dub: data.latestDub.media },
      upcoming: data.upcoming.media,
      newRelease: data.newRelease.media,
      top: { day: data.topDay.media, week: data.topWeek.media, month: data.topMonth.media },
    };
  });
}

export async function searchAnime(query) {
  return cachedFetch(`search:${query}`, async () => {
    const data = await gql(`
      query ($search: String) {
        Page(page: 1, perPage: 30) {
          media(search: $search, type: ANIME, sort: POPULARITY_DESC) { ${CARD_FIELDS} }
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
        Media(id: $id, type: ANIME) {
          ${HERO_FIELDS}
          studios { nodes { name } }
          seasonYear season
        }
      }
    `, { id });
    return data.Media;
  });
}

export function prefetchAnime(id) {
  if (!cache.has(`anime:${id}`)) getAnimeById(id);
}

export function toSlug(title) {
  return (title?.english || title?.romaji || '')
    .toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

export function formatDate(dateObj) {
  if (!dateObj?.year) return '?';
  return `${dateObj.year}-${String(dateObj.month).padStart(2,'0')}-${String(dateObj.day).padStart(2,'0')}`;
}
