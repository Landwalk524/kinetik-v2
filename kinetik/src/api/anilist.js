const ANILIST_URL = 'https://graphql.anilist.co';

export async function searchAnime(query) {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ($search: String) {
          Page(page: 1, perPage: 20) {
            media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
              id
              title { romaji english }
              episodes
              status
              coverImage { large }
              description
              genres
              averageScore
            }
          }
        }
      `,
      variables: { search: query }
    })
  });
  const data = await res.json();
  return data.data.Page.media;
}

export async function getAnimeById(id) {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
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
          }
        }
      `,
      variables: { id }
    })
  });
  const data = await res.json();
  return data.data.Media;
}

export async function getTrendingAnime() {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          Page(page: 1, perPage: 20) {
            media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
              id
              title { romaji english }
              episodes
              coverImage { large }
              averageScore
              genres
            }
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.Page.media;
}

export async function getPopularAnime() {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          Page(page: 1, perPage: 20) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title { romaji english }
              episodes
              coverImage { large }
              averageScore
              genres
            }
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.Page.media;
}

export async function getSeasonalAnime() {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          Page(page: 1, perPage: 20) {
            media(type: ANIME, sort: POPULARITY_DESC, season: SPRING, seasonYear: 2026) {
              id
              title { romaji english }
              episodes
              coverImage { large }
              averageScore
              genres
            }
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.Page.media;
}

export function toSlug(title) {
  return (title?.english || title?.romaji || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
