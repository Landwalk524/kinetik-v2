import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopAnime({ top }) {
  const [tab, setTab] = useState('day');
  const navigate = useNavigate();
  const list = top?.[tab] || [];

  return (
    <div className="bg-[#111d2b] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <h3 className="text-white font-bold text-sm">Top anime</h3>
        <div className="flex gap-1">
          {['day', 'week', 'month'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors capitalize ${
                tab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {list.slice(0, 8).map((anime, i) => {
          const malId = anime.idMal || anime.mal_id;
          if (!malId) return null;
          const ep = anime.nextAiringEpisode?.episode
            ? anime.nextAiringEpisode.episode - 1
            : anime.episodes;
          return (
            <div
              key={anime.id || malId}
              onClick={() => navigate(`/anime/${malId}`)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <span className="text-2xl font-black text-blue-500/60 w-6 flex-shrink-0">{i + 1}</span>
              <img
                src={anime.coverImage?.medium || anime.coverImage?.large}
                alt=""
                className="w-10 h-14 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  {anime.title?.english || anime.title?.romaji}
                </p>
                <div className="flex gap-2 mt-1">
                  {ep && <span className="text-[10px] text-gray-400">EP {ep}</span>}
                  <span className="text-[10px] text-gray-400">{anime.format || 'TV'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
