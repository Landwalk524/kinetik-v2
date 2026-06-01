import React from 'react';
import { useNavigate } from 'react-router-dom';
import { prefetchAnime } from '../api/anilist';

export default function AnimeCard({ anime, showEp }) {
  const navigate = useNavigate();
  const ep = anime.nextAiringEpisode?.episode
    ? anime.nextAiringEpisode.episode - 1
    : anime.episodes;

  return (
    <div
      onClick={() => navigate(`/anime/${anime.id}`)}
      onMouseEnter={() => prefetchAnime(anime.id)}
      className="cursor-pointer group relative rounded overflow-hidden bg-[#111d2b] hover:ring-1 hover:ring-blue-500 transition-all duration-200"
    >
      <div className="relative">
        <img
          src={anime.coverImage?.large || anime.coverImage?.medium}
          alt={anime.title?.romaji}
          loading="lazy"
          className="w-full aspect-[3/4] object-cover group-hover:brightness-110 transition-all"
        />
        {/* Format badge */}
        <span className="absolute top-1.5 left-1.5 bg-[#0d1520]/80 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-bold">
          {anime.format || 'TV'}
        </span>
        {/* Episode count */}
        {ep && (
          <div className="absolute bottom-1.5 right-1.5 flex gap-1">
            <span className="bg-[#0d1520]/90 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              CC {ep}
            </span>
            <span className="bg-[#0d1520]/90 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              🎤 {ep}
            </span>
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold truncate text-white leading-snug">
          {anime.title?.english || anime.title?.romaji}
        </p>
      </div>
    </div>
  );
}
