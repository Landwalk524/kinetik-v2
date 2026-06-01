import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime } from '../api/anilist';
import AnimeCard from '../components/AnimeCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchAnime(query).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-16">
      <h1 className="text-2xl font-bold mb-2">
        Results for <span className="text-blue-400">"{query}"</span>
      </h1>
      <p className="text-gray-500 text-sm mb-8">{results.length} anime found</p>

      {loading ? (
        <div className="text-center text-gray-500 py-20">Searching...</div>
      ) : results.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No results found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((a) => <AnimeCard key={a.id} anime={a} />)}
        </div>
      )}
    </div>
  );
}
