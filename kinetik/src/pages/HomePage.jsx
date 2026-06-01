import React, { useEffect, useState } from 'react';
import { getHomepageData } from '../api/anilist';
import HeroSlider from '../components/HeroSlider';
import LatestEpisodes from '../components/LatestEpisodes';
import AnimeCard from '../components/AnimeCard';
import AnimeListRow from '../components/AnimeListRow';
import Sidebar from '../components/Sidebar';

function SectionBlock({ title, anime }) {
  if (!anime?.length) return null;
  return (
    <div className="bg-[#111d2b] rounded-lg overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-2 py-2 divide-y divide-white/5">
        {anime.slice(0, 6).map((a) => <AnimeListRow key={a.id} anime={a} />)}
      </div>
    </div>
  );
}

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

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getHomepageData().then(setData).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1520] text-white pt-14">
      {/* Hero */}
      <HeroSlider slides={data?.hero} />

      {/* Share bar */}
      <div className="bg-[#0f1824] border-y border-white/5 text-center py-2.5 text-xs text-gray-500">
        ℹ️ If you enjoy Kinetik, please consider sharing it with your friends. Thank you!
      </div>

      {/* Main layout */}
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left content */}
        <main className="flex-1 min-w-0">
          {/* Latest Episodes */}
          <div className="mb-8">
            <div className="mb-3">
              {!data ? (
                <SkeletonGrid />
              ) : (
                <LatestEpisodes latest={data?.latest} />
              )}
            </div>
          </div>

          {/* Upcoming Anime */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-base">Upcoming Anime</h2>
              <a href="#" className="text-blue-400 text-xs hover:underline">View more →</a>
            </div>
            {!data ? (
              <SkeletonGrid />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(data.upcoming || []).map((a) => <AnimeCard key={a.id} anime={a} />)}
              </div>
            )}
          </div>

          {/* A-Z List */}
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

        {/* Sidebar */}
        <Sidebar top={data?.top} newRelease={data?.newRelease} />
      </div>
    </div>
  );
}
