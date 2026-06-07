import React, { useState, useEffect } from 'react';

/**
 * EpisodeServers
 *
 * Props:
 *   malId   — MyAnimeList numeric ID
 *   episode — episode number (1-based)
 *   slug    — gogoanime-style slug (e.g. "naruto")
 */
export default function EpisodeServers({ malId, episode, slug }) {
  // Build server list — ordered by reliability (most stable first)
  const buildServers = (malId, episode, slug) => ({
    SUB: [
      {
        name: 'Server 1',
        // s3taku: no x-frame-options, uses gogoanime slug-based IDs
        getUrl: () => `https://s3taku.com/streaming.php?id=${slug}-episode-${episode}&title=${encodeURIComponent(slug)}&typesub=SUB`,
      },
      {
        name: 'Server 2',
        // 2anime embed with MAL ID
        getUrl: () => `https://2anime.xyz/embed/${malId}/${episode}`,
      },
      {
        name: 'Server 3',
        // 9anime-style embed
        getUrl: () => `https://9anime.pl/embed/${malId}/${episode}`,
      },
      {
        name: 'Server 4',
        // anime3rb embed
        getUrl: () => `https://anime3rb.com/watch/${slug}-episode-${episode}`,
      },
    ],
    DUB: [
      {
        name: 'Server 1',
        getUrl: () => `https://s3taku.com/streaming.php?id=${slug}-dub-episode-${episode}&title=${encodeURIComponent(slug)}&typesub=DUB`,
      },
      {
        name: 'Server 2',
        getUrl: () => `https://2anime.xyz/embed/${malId}/${episode}?dub=1`,
      },
    ],
  });

  const [activeType, setActiveType] = useState('SUB');
  const [activeServer, setActiveServer] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const SERVERS = buildServers(malId, episode, slug);

  useEffect(() => {
    setActiveType('SUB');
    setActiveServer(0);
    setIframeKey((k) => k + 1);
    setLoadError(false);
  }, [episode, malId]);

  useEffect(() => {
    setLoadError(false);
    setIframeKey((k) => k + 1);
  }, [activeType, activeServer]);

  const servers = SERVERS[activeType];
  const currentUrl = servers[activeServer].getUrl();

  function tryNext() {
    const nextIdx = activeServer + 1;
    if (nextIdx < servers.length) {
      setActiveServer(nextIdx);
    } else {
      // switch type and reset
      const otherType = activeType === 'SUB' ? 'DUB' : 'SUB';
      setActiveType(otherType);
      setActiveServer(0);
    }
    setLoadError(false);
  }

  return (
    <div className="w-full">
      {/* 16:9 Player */}
      <div
        className="relative w-full bg-black rounded-xl overflow-hidden"
        style={{ paddingBottom: '56.25%' }}
      >
        <iframe
          key={`${iframeKey}-${currentUrl}`}
          src={currentUrl}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => setLoadError(true)}
        />

        {/* Error overlay */}
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1220] gap-4 z-10">
            <span className="text-5xl">⚠️</span>
            <p className="text-white font-semibold text-sm">This server isn't loading.</p>
            <button
              onClick={tryNext}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Try Next Server →
            </button>
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="mt-2 flex items-center gap-2 text-yellow-400/70 text-xs px-1">
        <span>⚡</span>
        <span>If the player is blank or shows an error, click a different server below.</span>
      </div>

      {/* Server selector */}
      <div className="mt-2 bg-[#111d2b] rounded-xl overflow-hidden divide-y divide-white/5">
        {Object.entries(SERVERS).map(([type, servers]) => (
          <div key={type} className="flex items-center gap-3 px-4 py-3">
            <span
              className={`text-xs font-bold w-9 flex-shrink-0 ${
                type === 'DUB' ? 'text-yellow-400' : 'text-blue-400'
              }`}
            >
              {type}
            </span>
            <div className="flex gap-2 flex-wrap">
              {servers.map((server, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveType(type);
                    setActiveServer(i);
                  }}
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
    </div>
  );
}
