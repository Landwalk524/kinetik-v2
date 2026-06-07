import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnimeListRow({ anime }) {
  const navigate = useNavigate();
  const malId = anime.idMal || anime.mal_id;
  const ep = anime.nextAiringEpisode?.episode
    ? anime.nextAiringEpisode.episode - 1
    : anime.episodes;

  if (!malId) return null;

  return (
    <div
      onClick={() => navigate(`/anime/${malId}`)}
      className="flex items-center gap-3 py-2 cursor-pointer hover:bg-white/5 rounded px-2 transition-colors group"
    >
      <img
        src={anime.coverImage?.medium || anime.coverImage?.large}
        alt=""
        className="w-10 h-14 object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate group-hover:text-blue-400 transition-colors">
          {anime.title?.english || anime.title?.romaji}
        </p>
        <div className="flex gap-2 mt-1 flex-wrap">
          {ep && <span className="text-[10px] text-gray-500">EP {ep}</span>}
          <span className="text-[10px] text-gray-500">{anime.format || 'TV'}</span>
        </div>
      </div>
    </div>
  );
}
