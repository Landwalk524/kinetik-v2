import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime } from '../api/anilist';
import AnimeCard from '../components/AnimeCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchAnime(query)
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setResults(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0d1520] text-white pt-20 px-4 max-w-screen-xl mx-auto">
      <h1 className="text-xl font-bold mb-1">
        Results for <span className="text-blue-400">"{query}"</span>
      </h1>
      <p className="text-gray-500 text-sm mb-6">{results.length} anime found</p>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="rounded bg-[#111d2b] animate-pulse">
              <div className="w-full aspect-[3/4] bg-[#1a2535]" />
              <div className="p-2"><div className="h-2.5 bg-[#1a2535] rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {results.map((a) => <AnimeCard key={a.idMal || a.id} anime={a} />)}
        </div>
      )}
    </div>
  );
}
