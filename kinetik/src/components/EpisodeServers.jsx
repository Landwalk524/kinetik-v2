import React, { useState, useEffect } from 'react';

export default function EpisodeServers({ animeSlug, episode, anilistId }) {
  const SERVERS = {
    SUB: [
      { name: 'Vidstream-1', getUrl: () => `https://vidstreaming.io/streaming.php?id=${animeSlug}-episode-${episode}` },
      { name: 'VidCloud-1', getUrl: () => `https://rabbitstream.net/embed-4/${animeSlug}-episode-${episode}` },
      { name: 'VidSrc', getUrl: () => `https://vidsrc.me/embed/anime/${anilistId}/1/${episode}` },
    ],
    DUB: [
      { name: 'Vidstream-1', getUrl: () => `https://vidstreaming.io/streaming.php?id=${animeSlug}-dub-episode-${episode}` },
      { name: 'VidCloud-1', getUrl: () => `https://rabbitstream.net/embed-4/${animeSlug}-dub-episode-${episode}` },
      { name: 'VidSrc-2', getUrl: () => `https://vidsrc.to/embed/anime/${anilistId}/1/${episode}` },
    ],
  };

  const [activeType, setActiveType] = useState('SUB');
  const [activeServer, setActiveServer] = useState(0);

  useEffect(() => { setActiveServer(0); }, [episode]);

  const currentUrl = SERVERS[activeType][activeServer].getUrl();

  return (
    <div className="w-full">
      {/* Player */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%', background: '#000', borderRadius: 8, overflow: 'hidden' }}>
        <iframe
          key={currentUrl}
          src={currentUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </div>

      {/* Server Tabs */}
      <div className="mt-3 bg-[#111d2b] rounded-lg divide-y divide-white/5">
        {Object.entries(SERVERS).map(([type, servers]) => (
          <div key={type} className="flex items-center gap-4 px-4 py-3">
            <div className="flex items-center gap-2 w-16 flex-shrink-0">
              <span className="text-gray-400 text-xs font-bold">{type}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {servers.map((server, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveType(type); setActiveServer(i); }}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    activeType === type && activeServer === i
                      ? 'bg-blue-600 text-white'
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
