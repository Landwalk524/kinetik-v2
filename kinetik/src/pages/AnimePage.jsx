import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById, toSlug, formatDate } from '../api/anilist';
import EpisodeList from '../components/EpisodeList';
import EpisodeServers from '../components/EpisodeServers';

export default function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSelectedEpisode(1);
    getAnimeById(Number(id)).then((data) => {
      setAnime(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0d1520] flex items-center justify-center pt-14">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!anime) return (
    <div className="min-h-screen bg-[#0d1520] flex items-center justify-center text-white pt-14">
      Anime not found.
    </div>
  );

  const totalEpisodes = anime.episodes || 24;
  const animeSlug = toSlug(anime.title);

  return (
    <div className="min-h-screen bg-[#0d1520] text-white pt-14">
      {/* Banner */}
      {anime.bannerImage && (
        <div className="relative h-40 overflow-hidden">
          <img src={anime.bannerImage} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1520]" />
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Anime Info */}
        <div className="flex gap-5 mb-8">
          <img
            src={anime.coverImage?.extraLarge || anime.coverImage?.large}
            alt={anime.title?.romaji}
            className="w-28 h-40 object-cover rounded-lg shadow-xl flex-shrink-0 hidden sm:block border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black mb-1">{anime.title?.english || anime.title?.romaji}</h1>
            {anime.title?.english && <p className="text-gray-500 text-sm mb-2">{anime.title?.romaji}</p>}
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="bg-white/10 text-xs px-2 py-0.5 rounded">PG-13</span>
              <span className="bg-white/10 text-xs px-2 py-0.5 rounded">HD</span>
              <span className="bg-white/10 text-xs px-2 py-0.5 rounded">CC</span>
              {anime.startDate?.year && (
                <span className="text-gray-400 text-xs self-center">
                  {formatDate(anime.startDate)} to {anime.endDate?.year ? formatDate(anime.endDate) : '?'}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {anime.genres?.slice(0, 5).map((g) => (
                <span key={g} className="bg-blue-900/40 border border-blue-800/40 text-blue-300 text-xs px-2 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
            <p
              className="text-gray-400 text-xs leading-relaxed line-clamp-4 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: anime.description }}
            />
          </div>
        </div>

        {/* Player + Episode List */}
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 text-xs mb-2">▶ Now playing: Episode {selectedEpisode}</p>
            <EpisodeServers animeSlug={animeSlug} episode={selectedEpisode} anilistId={anime.id} />
          </div>
          <div className="w-full lg:w-72 flex-shrink-0">
            <EpisodeList totalEpisodes={totalEpisodes} selectedEpisode={selectedEpisode} onEpisodeSelect={setSelectedEpisode} />
          </div>
        </div>
      </div>
    </div>
  );
}
