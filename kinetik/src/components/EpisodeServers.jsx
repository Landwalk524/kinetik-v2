import React, { useState, useEffect } from 'react';

export default function EpisodeServers({ animeSlug, episode, anilistId }) {
  const SERVERS = {
    SUB: [
      { name: 'VidSrc',      getUrl: () => `https://vidsrc.to/embed/anime/${anilistId}/1/${episode}` },
      { name: 'VidSrc-2',    getUrl: () => `https://vidsrc.me/embed/anime/${anilistId}/1/${episode}` },
      { name: 'VidSrc-3',    getUrl: () => `https://vidsrc.xyz/embed/anime/${anilistId}/1/${episode}` },
      { name: 'Vidstream',   getUrl: () => `https://vidstreaming.io/streaming.php?id=${animeSlug}-episode-${episode}` },
      { name: 'AnimeOwl',    getUrl: () => `https://animeowl.live/anime/${animeSlug}/episode-${episode}` },
    ],
    DUB: [
      { name: 'VidSrc',      getUrl: () => `https://vidsrc.to/embed/anime/${anilistId}/1/${episode}?dubbing=true` },
      { name: 'VidSrc-2',    getUrl: () => `https://vidsrc.me/embed/anime/${anilistId}/1/${episode}` },
      { name: 'Vidstream',   getUrl: () => `https://vidstreaming.io/streaming.php?id=${animeSlug}-dub-episode-${episode}` },
    ],
  };

  const [activeType, setActiveType] = useState('SUB');
  const [activeServer, setActiveServer] = useState(0);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => { setActiveServer(0); setBlocked(false); }, [episode]);
  useEffect(() => { setBlocked(false); }, [activeType, activeServer]);

  const currentUrl = SERVERS[activeType][activeServer].getUrl();

  return (
    <div className="w-full">
      {/* Player */}
      <div
        className="relative w-full bg-black rounded-lg overflow-hidden"
        style={{ paddingBottom: '56.25%' }}
      >
        <iframe
          key={currentUrl}
          src={currentUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          onError={() => setBlocked(true)}
        />

        {/* Blocked overlay hint */}
        {blocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1520] text-center px-6 gap-4">
            <span className="text-4xl">⚠️</span>
            <p className="text-white font-semibold">This server is unavailable or blocked.</p>
            <p className="text-gray-400 text-sm">Try another server below, or disable your ad blocker for this site.</p>
          </div>
        )}
      </div>

      {/* Ad blocker notice */}
      <div className="mt-2 bg-yellow-900/20 border border-yellow-700/30 text-yellow-300 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
        <span>⚠️</span>
        <span>If the player shows "blocked by extension", disable your ad blocker for this site or try a different server below.</span>
      </div>

      {/* Server Tabs */}
      <div className="mt-2 bg-[#111d2b] rounded-lg divide-y divide-white/5">
        {Object.entries(SERVERS).map(([type, servers]) => (
          <div key={type} className="flex items-center gap-4 px-4 py-3">
            <span className="text-gray-400 text-xs font-bold w-10 flex-shrink-0">{type}</span>
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
