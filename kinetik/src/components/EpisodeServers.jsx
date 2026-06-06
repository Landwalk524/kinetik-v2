import React, { useState, useEffect } from 'react';

/**
 * EpisodeServers
 * 
 * Props:
 *   malId    — MyAnimeList numeric ID (e.g. 38000 for Demon Slayer)
 *   episode  — episode number (1-based integer)
 *   slug     — gogoanime-style slug (e.g. "demon-slayer-kimetsu-no-yaiba")
 */
export default function EpisodeServers({ malId, episode, slug }) {
  // VidLink URL: /anime/[MAL_ID]/[EP_NUM]/[1=sub, 2=dub]
  // No sandbox attribute — some players actively block sandboxed iframes
  const SERVERS = {
    SUB: [
      {
        name: 'VidLink',
        getUrl: () => `https://vidlink.pro/anime/${malId}/${episode}/1`,
      },
      {
        name: '2Embed',
        getUrl: () => `https://2embed.skin/embed/anime?id=${malId}&ep=${episode}`,
      },
      {
        name: 'Anime.js',
        getUrl: () => `https://player.smashy.stream/anime/${malId}?ep=${episode}`,
      },
    ],
    DUB: [
      {
        name: 'VidLink',
        getUrl: () => `https://vidlink.pro/anime/${malId}/${episode}/2`,
      },
      {
        name: '2Embed',
        getUrl: () => `https://2embed.skin/embed/anime?id=${malId}&ep=${episode}&dub=1`,
      },
    ],
  };

  const [activeType, setActiveType] = useState('SUB');
  const [activeServer, setActiveServer] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  // Reset on episode change
  useEffect(() => {
    setActiveType('SUB');
    setActiveServer(0);
    setIframeKey((k) => k + 1);
  }, [episode, malId]);

  const currentUrl = SERVERS[activeType][activeServer].getUrl();

  return (
    <div className="w-full">
      {/* 16:9 Player */}
      <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <iframe
          key={iframeKey}
          src={currentUrl}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer-when-downgrade"
          // NOTE: NO sandbox attribute — embed players actively detect and block sandboxed iframes
        />
      </div>

      {/* Server selector */}
      <div className="mt-3 bg-[#111d2b] rounded-xl overflow-hidden">
        {Object.entries(SERVERS).map(([type, servers]) => (
          <div key={type} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0">
            <span className={`text-xs font-bold w-9 flex-shrink-0 ${type === 'DUB' ? 'text-yellow-400' : 'text-blue-400'}`}>
              {type}
            </span>
            <div className="flex gap-2 flex-wrap">
              {servers.map((server, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveType(type); setActiveServer(i); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeType === type && activeServer === i
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1a2535] text-gray-400 hover:text-white hover:bg-[#223048] border border-white/10'
                  }`}
                >
                  ▶ {server.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 text-gray-600 text-xs text-center">
        If a player doesn't load, try the next server.
      </p>
    </div>
  );
}
