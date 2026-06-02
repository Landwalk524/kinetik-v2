// Anime stream proxy — fetches episode sources from hianime.to
// Returns working m3u8/mp4 sources OR an embed URL for the player

Deno.serve(async (req) => {
  // CORS headers so Kinetik (Cloudflare Pages) can call this
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { animeSlug, episode, anilistId } = body;

    if (!animeSlug || !episode) {
      return Response.json({ error: 'animeSlug and episode are required' }, { status: 400, headers: cors });
    }

    // Step 1: Search hianime for the anime to get its hianime ID
    const searchUrl = `https://hianime.to/search?keyword=${encodeURIComponent(animeSlug)}&page=1`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Referer': 'https://hianime.to/',
      }
    });

    const searchHtml = await searchRes.text();

    // Extract anime ID from search results
    const idMatch = searchHtml.match(/href="\/([a-z0-9-]+-\d+)"[^>]*class="[^"]*film-name/);
    const hiAnimeSlug = idMatch ? idMatch[1] : null;

    if (!hiAnimeSlug) {
      // Fallback: construct slug from animeSlug
      return Response.json({
        sources: [],
        embedUrl: `https://vidsrc.to/embed/anime/${anilistId}/1/${episode}`,
        fallback: true,
      }, { headers: cors });
    }

    // Step 2: Get episode list for this anime
    // hianime uses a numeric anime ID in ajax calls
    const animeNumId = hiAnimeSlug.split('-').pop();
    const epListRes = await fetch(`https://hianime.to/ajax/v2/episode/list/${animeNumId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': `https://hianime.to/watch/${hiAnimeSlug}`,
      }
    });

    const epData = await epListRes.json();
    const epHtml = epData?.html || '';

    // Extract episode data-id for the requested episode number
    const epRegex = new RegExp(`data-number="${episode}"[^>]*data-id="(\\d+)"`);
    const epIdMatch = epHtml.match(epRegex);
    const episodeId = epIdMatch ? epIdMatch[1] : null;

    if (!episodeId) {
      return Response.json({
        sources: [],
        embedUrl: `https://vidsrc.to/embed/anime/${anilistId}/1/${episode}`,
        fallback: true,
        hiAnimeSlug,
      }, { headers: cors });
    }

    // Step 3: Get streaming servers for this episode
    const serverRes = await fetch(`https://hianime.to/ajax/v2/episode/servers?episodeId=${episodeId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': `https://hianime.to/watch/${hiAnimeSlug}`,
      }
    });

    const serverData = await serverRes.json();

    // Return the episode ID and embed URL via 4animo
    return Response.json({
      success: true,
      episodeId,
      hiAnimeSlug,
      embedUrl: `https://cdn.4animo.xyz/api/embed/hd-1/${episodeId}/sub?k=1&autoPlay=1&skipIntro=1&skipOutro=1`,
      dubEmbedUrl: `https://cdn.4animo.xyz/api/embed/hd-1/${episodeId}/dub?k=1&autoPlay=1&skipIntro=1&skipOutro=1`,
      servers: serverData,
    }, { headers: cors });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500, headers: cors });
  }
});
