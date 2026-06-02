import React, { useState, useEffect } from 'react';

// animeSlug = gogoanime-style slug (e.g. "naruto")
// episode   = episode number (e.g. 1)
// anilistId = AniList numeric ID
// malId     = MyAnimeList numeric ID (different from AniList!)
export default function EpisodeServers({ animeSlug, episode, anilistId, malId }) {
  // Use MAL ID where needed — it's what most embed services index by.
  // Fall back to anilistId if malId is missing (they're often the same for older shows).
  const id = malId || anilistId;

  const SERVERS = {
    SUB: [
      {
        name: 'VidLink',
        // vidlink uses MAL ID: /anime/[malId]/[episode]/1 (1=sub, 2=dub)
        getUrl: () => `https://vidlink.pro/anime/${id}/${episode}/1`,
      },
      {
        name: '2Embed',
        getUrl: () => `https://2embed.skin/embed/anime?id=${id}&ep=${episode}`,
      },
      {
        name: 'NontonGo',
        // Uses gogoanime-style slug: animeSlug-episode-N
        getUrl: () => `https://www.nontongo.win/embed/anime/${animeSlug}-episode-${episode}`,
      },
      {
        name: 'GogoPlay',
        getUrl: () => `https://gogoanime.hu/streaming.php?id=${animeSlug}-episode-${episode}`,
      },
    ],
    DUB: [
      {
        name: 'VidLink',
        getUrl: () => `https://vidlink.pro/anime/${id}/${episode}/2`,
      },
      {
        name: '2Embed',
        getUrl: () => `https://2embed.skin/embed/anime?id=${id}&ep=${episode}&dub=1`,
      },
    ],
  };

  const [activeType, setActiveType] = useState('SUB');
  const [activeServer, setActiveServer] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setActiveServer(0);
    setActiveType('SUB');
    setIframeKey((k) => k + 1);
  }, [episode]);

  useEffect(() => {
    setIframeKey((k) => k + 1);
  }, [activeType, activeServer]);

  const currentUrl = SERVERS[activeType][activeServer].getUrl();

  return (
    <div className="w-full">
      {/* Player */}
      <div
        className="relative w-full bg-black rounded-lg overflow-hidden"
        style={{ paddingBottom: '56.25%' }}
      >
        <iframe
          key={iframeKey}
          src={currentUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        />
      </div>

      {/* Tip */}
      <div className="mt-2 bg-blue-900/20 border border-blue-700/30 text-blue-300 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
        <span>💡</span>
        <span>VidLink works best. If a server shows a blank screen, try the next one.</span>
      </div>

      {/* Server Selector */}
      <div className="mt-2 bg-[#111d2b] rounded-lg">
        {Object.entries(SERVERS).map(([type, servers]) => (
          <div key={type} className="flex items-center gap-4 px-4 py-3 border-b border-white/5 last:border-b-0">
            <span className="text-gray-400 text-xs font-bold w-10 flex-shrink-0">{type}</span>
            <div className="flex gap-2 flex-wrap">
              {servers.map((server, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveType(type); setActiveServer(i); }}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    activeType === type && activeServer === i
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : 'bg-[#1a2535] text-gray-300 hover:bg-[#223048] border border-white/10'
                  }`}
                >
                  ▶ {server.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
