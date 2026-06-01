import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimeCard from './AnimeCard';

const TABS = ['All', 'Sub', 'Dub', 'Trending', 'Random'];

export default function LatestEpisodes({ latest }) {
  const [tab, setTab] = useState('All');

  const getList = () => {
    if (!latest) return [];
    if (tab === 'Sub') return latest.sub || [];
    if (tab === 'Dub') return latest.dub || [];
    if (tab === 'Trending') return [...(latest.all || [])].sort(() => Math.random() - 0.5).slice(0, 12);
    if (tab === 'Random') return [...(latest.all || [])].sort(() => Math.random() - 0.5).slice(0, 12);
    return latest.all || [];
  };

  const list = getList();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-bold text-base">Latest Episode</h2>
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                tab === t ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
          <button className="text-gray-500 px-1">‹</button>
          <button className="text-gray-500 px-1">›</button>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {list.map((a) => <AnimeCard key={a.id} anime={a} showEp />)}
      </div>
    </div>
  );
}
