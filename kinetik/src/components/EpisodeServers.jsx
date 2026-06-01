import React, { useState, useEffect } from 'react';

export default function EpisodeServers({ animeSlug, episode, anilistId }) {
  const SERVERS = {
    SUB: [
      { name: 'Vidstream-2', getUrl: () => `https://vidstreaming.io/streaming.php?id=${animeSlug}-episode-${episode}` },
      { name: 'VidCloud-1', getUrl: () => `https://rabbitstream.net/embed-4/${animeSlug}-episode-${episode}` },
    ],
    'H-SUB': [
      { name: 'Download', getUrl: () => `https://gogoanime.tel/${animeSlug}-episode-${episode}` },
    ],
    DUB: [
      { name: 'Vidstream-2', getUrl: () => `https://vidstreaming.io/streaming.php?id=${animeSlug}-dub-episode-${episode}` },
      { name: 'VidCloud-1', getUrl: () => `https://rabbitstream.net/embed-4/${animeSlug}-dub-episode-${episode}` },
    ],
    'A-DUB': [
      { name: 'Kiwi-Stream', getUrl: () => `https://vidsrc.me/embed/anime/${anilistId}/1/${episode}` },
      { name: 'VidSrc-2', getUrl: () => `https://vidsrc.to/embed/anime/${anilistId}/1/${episode}` },
    ],
  };

  const [activeType, setActiveType] = useState('SUB');
  const [activeServer, setActiveServer] = useState(0);

  useEffect(() => {
    setActiveServer(0);
  }, [episode]);

  const currentUrl = SERVERS[activeType][activeServer].getUrl();

  return (
    <div className="w-full">
      {/* Video Player */}
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          marginBottom: '12px',
          backgroundColor: '#000',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(37, 99, 235, 0.2)',
        }}
      >
        <iframe
          key={currentUrl}
          src={currentUrl}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            border: 'none',
          }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </div>

      {/* Now Playing */}
      <p className="text-blue-400 text-xs mb-3 font-medium">
        ▶ Episode {episode} · {activeType} · {SERVERS[activeType][activeServer].name}
      </p>

      {/* Server Selector */}
      <div className="bg-gray-900 border border-blue-900/30 rounded-lg divide-y divide-gray-800">
        {Object.entries(SERVERS).map(([type, servers]) => (
          <div key={type} className="flex items-center gap-4 px-4 py-3">
            {/* Type Badge */}
            <div className="flex items-center gap-2 w-24 flex-shrink-0">
              <span className="bg-gray-800 text-blue-400 text-xs px-1.5 py-0.5 rounded font-bold border border-blue-900/50">
                {type === 'SUB' || type === 'H-SUB' ? 'CC' : '🎤'}
              </span>
              <span className="text-gray-200 text-sm font-semibold">{type}</span>
            </div>

            {/* Server Buttons */}
            <div className="flex gap-2 flex-wrap">
              {servers.map((server, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveType(type); setActiveServer(i); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    activeType === type && activeServer === i
                      ? 'bg-blue-600 text-white shadow shadow-blue-800'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
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
