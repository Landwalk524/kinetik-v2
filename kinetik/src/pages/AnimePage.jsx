import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById, toSlug } from '../api/anilist';
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
    <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400">Loading...</span>
      </div>
    </div>
  );

  if (!anime) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      Anime not found.
    </div>
  );

  const totalEpisodes = anime.episodes || 24;
  const animeSlug = toSlug(anime.title);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      {anime.bannerImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={anime.bannerImage}
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-20">
        {/* Anime Info */}
        <div className="flex gap-6 mb-10">
          <img
            src={anime.coverImage?.extraLarge}
            alt={anime.title?.romaji}
            className="w-36 h-52 object-cover rounded-lg shadow-xl shadow-blue-900/30 flex-shrink-0 hidden sm:block border border-blue-900/30"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-1">
              {anime.title?.english || anime.title?.romaji}
            </h1>
            {anime.title?.english && (
              <p className="text-gray-500 text-sm mb-3">{anime.title?.romaji}</p>
            )}
            <div className="flex gap-2 flex-wrap mb-4">
              {anime.genres?.slice(0, 5).map((g) => (
                <span key={g} className="bg-blue-900/40 border border-blue-800/50 text-blue-300 text-xs px-2 py-1 rounded-full">
                  {g}
                </span>
              ))}
            </div>
            <div className="flex gap-6 text-sm text-gray-400 mb-4">
              {anime.averageScore && <span>⭐ {(anime.averageScore / 10).toFixed(1)}/10</span>}
              <span>📺 {totalEpisodes} eps</span>
              {anime.seasonYear && <span>📅 {anime.season} {anime.seasonYear}</span>}
              {anime.studios?.nodes?.[0] && <span>🎬 {anime.studios.nodes[0].name}</span>}
            </div>
            <p
              className="text-gray-300 text-sm leading-relaxed line-clamp-4 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: anime.description }}
            />
          </div>
        </div>

        {/* Player + Episodes */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Player */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 bg-blue-500 rounded-full" />
              <h2 className="text-white font-bold">Episode {selectedEpisode}</h2>
            </div>
            <EpisodeServers
              animeSlug={animeSlug}
              episode={selectedEpisode}
              anilistId={anime.id}
            />
          </div>

          {/* Right: Episode List */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 bg-blue-500 rounded-full" />
              <h2 className="text-white font-bold">All Episodes</h2>
            </div>
            <EpisodeList
              totalEpisodes={totalEpisodes}
              selectedEpisode={selectedEpisode}
              onEpisodeSelect={setSelectedEpisode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
