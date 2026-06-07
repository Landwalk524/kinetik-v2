import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1824] border-b border-white/5 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-white md:hidden">
          ☰
        </button>

        {/* Logo */}
        <div onClick={() => navigate('/')} className="cursor-pointer flex-shrink-0">
          <span className="text-xl font-black tracking-tight text-white">
            KIN<span className="text-blue-400">ETIK</span>
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full bg-[#1a2535] border border-white/10 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              🔍
            </button>
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto text-sm text-gray-300">
          <span onClick={() => navigate('/search?q=trending')} className="hidden md:block cursor-pointer hover:text-white transition-colors">🔀 Random</span>
          <span className="hidden md:flex items-center gap-1 cursor-pointer hover:text-white">
            <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">EN</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
            K
          </div>
        </div>
      </div>
    </nav>
  );
}
