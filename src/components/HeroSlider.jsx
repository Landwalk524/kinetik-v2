import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../api/anilist';

export default function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slides?.length) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides?.length) return <div className="w-full h-[420px] bg-[#0d1520] animate-pulse" />;

  const anime = slides[current];

  return (
    <div className="relative w-full h-[420px] overflow-hidden select-none">
      {/* Background image */}
      <img
        key={anime.id}
        src={anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1520] via-[#0d1520]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1520] via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-12 left-8 md:left-12 max-w-md z-10">
        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {anime.format && (
            <span className="bg-white/10 border border-white/20 text-white text-xs px-2 py-0.5 rounded font-medium">PG-13</span>
          )}
          <span className="bg-white/10 border border-white/20 text-white text-xs px-2 py-0.5 rounded font-medium">HD</span>
          <span className="bg-white/10 border border-white/20 text-white text-xs px-2 py-0.5 rounded font-medium">CC</span>
          {anime.startDate?.year && (
            <span className="text-gray-400 text-xs self-center">
              {formatDate(anime.startDate)} to {anime.endDate?.year ? formatDate(anime.endDate) : '?'}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight drop-shadow-lg">
          {anime.title?.english || anime.title?.romaji}
        </h1>

        <p
          className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-5"
          dangerouslySetInnerHTML={{ __html: anime.description?.replace(/<[^>]+>/g, '') || '' }}
        />

        <button
          onClick={() => navigate(`/anime/${anime.id}`)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-5 py-2.5 rounded transition-colors shadow-lg"
        >
          ▶ PLAY NOW
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-8 md:left-12 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-blue-400 w-4' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
