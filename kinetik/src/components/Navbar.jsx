import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-2xl font-black tracking-tight text-white">
            KIN<span className="text-blue-500">ETIK</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-400">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white transition-colors">Home</span>
          <span onClick={() => navigate('/search?q=action')} className="cursor-pointer hover:text-white transition-colors">Browse</span>
          <span onClick={() => navigate('/search?q=trending')} className="cursor-pointer hover:text-white transition-colors">Trending</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex justify-end">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full bg-gray-900 border border-blue-900/60 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 text-lg"
            >
              🔍
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}
