import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnimeCard({ anime }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/anime/${anime.id}`)}
      className="cursor-pointer group rounded-lg overflow-hidden bg-gray-900 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/40 transition-all duration-200"
    >
      <div className="relative">
        <img
          src={anime.coverImage?.large}
          alt={anime.title?.romaji}
          className="w-full aspect-[3/4] object-cover group-hover:brightness-110 transition-all"
        />
        {anime.averageScore && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
            ★ {(anime.averageScore / 10).toFixed(1)}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-2">
        <p className="text-sm font-semibold truncate text-white">
          {anime.title?.english || anime.title?.romaji}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}
        </p>
      </div>
    </div>
  );
}
