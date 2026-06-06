import React, { useEffect, useState } from 'react';
import { getHomepageData, getCover, getTitle } from '../api/jikan';
import HeroSlider from '../components/HeroSlider';
import AnimeCard from '../components/AnimeCard';
import Sidebar from '../components/Sidebar';

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded bg-[#111d2b] animate-pulse">
          <div className="w-full aspect-[3/4] bg-[#1a2535]" />
          <div className="p-2 space-y-1">
            <div className="h-2.5 bg-[#1a2535] rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

const ALPHABET = ['#', '0-9', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

// Normalize a Jikan anime to what AnimeCard/HeroSlider expect
export function normalizeAnime(a) {
  if (!a) return null;
  return {
    id: a.mal_id,
    mal_id: a.mal_id,
    title: { english: a.title_english || a.title, romaji: a.title },
    coverImage: { large: getCover(a), extraLarge: getCover(a) },
    bannerImage: getCover(a),
    episodes: a.episodes,
    status: a.status,
    genres: (a.genres || []).map(g => g.name),
    averageScore: a.score ? Math.round(a.score * 10) : null,
    description: a.synopsis,
    format: a.type,
    score: a.score,
  };
}

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getHomepageData()
      .then((raw) => {
        const normalize = (arr) => (arr || []).filter(Boolean).map(normalizeAnime);
        setData({
          hero: normalize(raw.airing).slice(0, 8),
          latest: normalize(raw.seasonal),
          upcoming: normalize(raw.upcoming),
          top: {
            day: normalize(raw.popular).slice(0, 10),
            week: normalize(raw.popular).slice(0, 10),
            month: normalize(raw.airing).slice(0, 10),
          },
          newRelease: normalize(raw.seasonal).slice(0, 5),
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1520] text-white pt-14">
      {/* Hero */}
      <HeroSlider slides={data?.hero} />

      {/* Banner */}
      <div className="bg-[#0f1824] border-y border-white/5 text-center py-2.5 text-xs text-gray-500">
        ℹ️ If you enjoy Kinetik, please share it with your friends!
      </div>

      {/* Main layout */}
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <main className="flex-1 min-w-0">

          {/* Currently Airing */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-base">Currently Airing</h2>
            </div>
            {!data ? <SkeletonGrid /> : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(data.latest || []).map((a) => <AnimeCard key={a.id} anime={a} />)}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-base">Upcoming Anime</h2>
            </div>
            {!data ? <SkeletonGrid /> : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(data.upcoming || []).map((a) => <AnimeCard key={a.id} anime={a} />)}
              </div>
            )}
          </div>

          {/* A-Z */}
          <div className="bg-[#111d2b] rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-400 mb-3">A-Z List — Search anime by alphabet</p>
            <div className="flex flex-wrap gap-1.5">
              {ALPHABET.map((letter) => (
                <span key={letter} className="px-2.5 py-1 bg-[#1a2535] hover:bg-blue-600 text-gray-300 hover:text-white text-xs rounded cursor-pointer transition-colors font-medium">
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </main>

        <Sidebar top={data?.top} newRelease={data?.newRelease} />
      </div>
    </div>
  );
}
