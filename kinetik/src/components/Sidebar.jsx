import React from 'react';
import TopAnime from './TopAnime';
import AnimeListRow from './AnimeListRow';

export default function Sidebar({ top, newRelease }) {
  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-5">
      {/* Top Anime */}
      <TopAnime top={top} />

      {/* New Release */}
      <div className="bg-[#111d2b] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
            NEW RELEASE
          </h3>
        </div>
        <div className="px-2 py-2 divide-y divide-white/5">
          {(newRelease || []).map((a) => <AnimeListRow key={a.id} anime={a} />)}
        </div>
      </div>
    </aside>
  );
}
