import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingAnime, getPopularAnime, getSeasonalAnime } from '../api/anilist';
import AnimeCard from '../components/AnimeCard';

function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-gray-900 animate-pulse">
      <div className="w-full aspect-[3/4] bg-gray-800" />
      <div className="p-2 space-y-2">
        <div className="h-3 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="mb-12">
      <div className="h-5 bg-gray-800 rounded w-40 mb-4 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [heroAnime, setHeroAnime] = useState(null);
  const [trendingLoaded, setTrendingLoaded] = useState(false);
  const [popularLoaded, setPopularLoaded] = useState(false);
  const [seasonalLoaded, setSeasonalLoaded] = useState(false);
  const navigate = useNavigate();

  // Load each section independently so they pop in as they arrive
  useEffect(() => {
    getTrendingAnime().then((data) => {
      setTrending(data);
      setHeroAnime(data[0]);
      setTrendingLoaded(true);
    }).catch(() => setTrendingLoaded(true));

    getPopularAnime().then((data) => {
      setPopular(data);
      setPopularLoaded(true);
    }).catch(() => setPopularLoaded(true));

    getSeasonalAnime().then((data) => {
      setSeasonal(data);
      setSeasonalLoaded(true);
    }).catch(() => setSeasonalLoaded(true));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Banner */}
      {heroAnime ? (
        <div className="relative w-full h-[70vh] overflow-hidden">
          <img
            src={heroAnime.coverImage?.large}
            alt={heroAnime.title?.romaji}
            className="w-full h-full object-cover object-center scale-110 blur-sm opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-16 left-8 md:left-16 max-w-lg">
            <div className="flex gap-2 mb-3">
              {heroAnime.genres?.slice(0, 3).map((g) => (
                <span key={g} className="bg-blue-600/80 text-white text-xs px-2 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
              {heroAnime.title?.english || heroAnime.title?.romaji}
            </h1>
            <p
              className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-5"
              dangerouslySetInnerHTML={{ __html: heroAnime.description?.replace(/<[^>]+>/g, '') }}
            />
            <button
              onClick={() => navigate(`/anime/${heroAnime.id}`)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/50"
            >
              ▶ Watch Now
            </button>
          </div>
        </div>
      ) : (
        // Hero skeleton
        <div className="w-full h-[70vh] bg-gray-900 animate-pulse" />
      )}

      {/* Content Sections */}
      <div className="px-6 md:px-16 py-10 -mt-6 relative z-10">
        {trendingLoaded
          ? <Section title="🔥 Trending Now" anime={trending} />
          : <SkeletonRow />}

        {seasonalLoaded
          ? <Section title="🌸 This Season" anime={seasonal} />
          : <SkeletonRow />}

        {popularLoaded
          ? <Section title="⭐ Most Popular" anime={popular} />
          : <SkeletonRow />}
      </div>
    </div>
  );
}

function Section({ title, anime }) {
  if (!anime.length) return null;
  return (
    <div className="mb-12">
      <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
        {title}
        <span className="flex-1 h-px bg-blue-900/40 ml-3" />
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {anime.map((a) => <AnimeCard key={a.id} anime={a} />)}
      </div>
    </div>
  );
}
