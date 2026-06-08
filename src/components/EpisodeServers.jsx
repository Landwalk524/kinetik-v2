import React, { useState, useEffect } from 'react';

/**
 * EpisodeServers
 * Props:
 *   malId   — MyAnimeList numeric ID
 *   episode — episode number (1-based)
 *   slug    — gogoanime-style slug (unused currently, kept for future)
 */

const buildServers = (malId, episode) => ({
  SUB: [
    {
      name: 'VidLink',
      // VidLink: /anime/{MAL_ID}/{episode}/{sub|dub} — confirmed working, no x-frame-options
      url: `https://vidlink.pro/anime/${malId}/${episode}/sub`,
    },
    {
      name: 'Server 2',
      // 2embed with anime-specific path
      url: `https://www.2embed.cc/embedanime/${malId}/${episode}`,
    },
    {
      name: 'Server 3',
      // embed.su anime path
      url: `https://embed.su/embed/anime/${malId}/${episode}`,
    },
    {
      name: 'Server 4',
      // vidsrc.xyz anime
      url: `https://vidsrc.xyz/embed/anime/mal/${malId}/${episode}/1`,
    },
  ],
  DUB: [
    {
      name: 'VidLink',
      url: `https://vidlink.pro/anime/${malId}/${episode}/dub`,
    },
    {
      name: 'Server 2',
      url: `https://www.2embed.cc/embedanime/${malId}/${episode}?dub=1`,
    },
  ],
});

export default function EpisodeServers({ malId, episode, slug }) {
  const [activeType, setActiveType] = useState('SUB');
  const [activeServer, setActiveServer] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  const SERVERS = buildServers(malId, episode);

  // Reset to Server 1 / SUB whenever episode or anime changes
  useEffect(() => {
    setActiveType('SUB');
    setActiveServer(0);
    setIframeKey((k) => k + 1);
  }, [episode, malId]);

  // Refresh iframe when server changes
  useEffect(() => {
    setIframeKey((k) => k + 1);
  }, [activeType, activeServer]);

  const currentUrl = SERVERS[activeType][activeServer].url;

  function tryNext() {
    const servers = SERVERS[activeType];
    const nextIdx = activeServer + 1;
    if (nextIdx < servers.length) {
      setActiveServer(nextIdx);
    } else {
      const otherType = activeType === 'SUB' ? 'DUB' : 'SUB';
      setActiveType(otherType);
      setActiveServer(0);
    }
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
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Hint */}
      <div className="mt-2 flex items-center gap-2 text-yellow-400/70 text-xs px-1">
        <span>⚡</span>
        <span>If the player is blank, try a different server below.</span>
        <button
          onClick={tryNext}
          className="ml-auto px-3 py-1 bg-[#1a2535] hover:bg-blue-700 text-gray-300 hover:text-white text-xs rounded-lg transition-colors"
        >
          Try Next →
        </button>
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
