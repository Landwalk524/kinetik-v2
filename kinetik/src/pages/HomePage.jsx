import React, { useEffect, useState } from 'react';
import { getHomepageData } from '../api/anilist';
import HeroSlider from '../components/HeroSlider';
import AnimeCard from '../components/AnimeCard';
import Sidebar from '../components/Sidebar';

function SkeletonCard() {
  return (
    <div className="rounded bg-[#111d2b] animate-pulse">
      <div className="w-full aspect-[3/4] bg-[#1a2535] rounded-t" />
      <div className="p-2 space-y-1">
        <div className="h-2.5 bg-[#1a2535] rounded w-3/4" />
      </div>
    </div>
  );
}

function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

const ALPHABET = ['#', '0-9', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHomepageData()
      .then(setData)
      .catch((err) => {
        console.error('Homepage load error:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1520] text-white pt-14">
      {/* Hero */}
      <HeroSlider slides={data?.hero} />

      {/* Banner */}
      <div className="bg-[#0f1824] border-y border-white/5 text-center py-2.5 text-xs text-gray-500">
        ℹ️ If you enjoy Kinetik, please share it with your friends!
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="bg-red-900/30 border border-red-500/40 text-red-300 text-sm rounded-lg px-4 py-3">
            ⚠️ Failed to load anime data: {error}. Please refresh.
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <main className="flex-1 min-w-0">

          {/* Currently Airing */}
          <section className="mb-8">
            <h2 className="text-white font-bold text-base mb-3">Currently Airing</h2>
            {!data ? <SkeletonGrid count={12} /> : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(data.latest?.sub || data.latest?.all || []).map((a) => (
                  <AnimeCard key={a.id} anime={a} />
                ))}
              </div>
            )}
          </section>

          {/* Upcoming */}
          <section className="mb-8">
            <h2 className="text-white font-bold text-base mb-3">Upcoming Anime</h2>
            {!data ? <SkeletonGrid count={12} /> : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(data.upcoming || []).map((a) => (
                  <AnimeCard key={a.id} anime={a} />
                ))}
              </div>
            )}
          </section>

          {/* A-Z */}
          <div className="bg-[#111d2b] rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-400 mb-3">A-Z List — Search anime by alphabet</p>
            <div className="flex flex-wrap gap-1.5">
              {ALPHABET.map((letter) => (
                <span
                  key={letter}
                  className="px-2.5 py-1 bg-[#1a2535] hover:bg-blue-600 text-gray-300 hover:text-white text-xs rounded cursor-pointer transition-colors font-medium"
                >
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
