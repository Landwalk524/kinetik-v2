import React, { useState } from 'react';

export default function EpisodeList({ totalEpisodes, selectedEpisode, onEpisodeSelect }) {
  const [search, setSearch] = useState('');
  const [range, setRange] = useState(0);
  const CHUNK = 100;
  const chunks = Math.ceil(totalEpisodes / CHUNK);
  const start = range * CHUNK + 1;
  const end = Math.min(start + CHUNK - 1, totalEpisodes);
  const episodes = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const filtered = search
    ? Array.from({ length: totalEpisodes }, (_, i) => i + 1).filter((ep) => ep.toString().includes(search))
    : episodes;

  return (
    <div className="bg-[#111d2b] rounded-lg p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">Episodes</h3>
        <input
          type="number"
          placeholder="Jump to..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a2535] border border-white/10 text-white text-xs px-3 py-1.5 rounded w-20 focus:outline-none focus:border-blue-500"
        />
      </div>
      {chunks > 1 && !search && (
        <div className="flex gap-2 flex-wrap mb-3">
          {Array.from({ length: chunks }, (_, i) => {
            const s = i * CHUNK + 1;
            const e = Math.min(s + CHUNK - 1, totalEpisodes);
            return (
              <button key={i} onClick={() => setRange(i)}
                className={`text-xs px-2 py-1 rounded font-medium transition-colors ${range === i ? 'bg-blue-600 text-white' : 'bg-[#1a2535] text-gray-400 hover:bg-[#223048]'}`}>
                {s}-{e}
              </button>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 max-h-72 overflow-y-auto pr-1">
        {filtered.map((ep) => (
          <button key={ep} onClick={() => onEpisodeSelect(ep)}
            className={`py-2 rounded text-xs font-medium transition-all ${
              selectedEpisode === ep ? 'bg-blue-600 text-white' : 'bg-[#1a2535] text-gray-300 hover:bg-blue-900 hover:text-white'
            }`}>
            {ep}
          </button>
        ))}
      </div>
    </div>
  );
}
