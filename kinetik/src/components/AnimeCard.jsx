import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnimeCard({ anime }) {
  const navigate = useNavigate();
  // anime.id is always the MAL ID (set in normalizeAnime / Jikan direct)
  const id = anime.mal_id || anime.id;
  const cover = anime.coverImage?.large || anime.coverImage?.medium || '';
  const title = anime.title?.english || anime.title?.romaji || anime.title || '';
  const eps = anime.episodes;
  const format = anime.format || 'TV';

  return (
    <div
      onClick={() => navigate(`/anime/${id}`)}
      className="cursor-pointer group relative rounded-lg overflow-hidden bg-[#111d2b] hover:ring-1 hover:ring-blue-500 transition-all duration-200"
    >
      <div className="relative">
        <img
          src={cover}
          alt={title}
          loading="lazy"
          className="w-full aspect-[3/4] object-cover group-hover:brightness-110 transition-all"
        />
        <span className="absolute top-1.5 left-1.5 bg-[#0d1520]/80 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-bold">
          {format}
        </span>
        {eps && (
          <span className="absolute bottom-1.5 right-1.5 bg-[#0d1520]/90 text-white text-[10px] px-1.5 py-0.5 rounded">
            {eps} ep{eps !== 1 ? 's' : ''}
          </span>
        )}
        {anime.score && (
          <span className="absolute bottom-1.5 left-1.5 bg-yellow-500/80 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">
            ★ {anime.score}
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold truncate text-white leading-snug">{title}</p>
      </div>
    </div>
  );
}
