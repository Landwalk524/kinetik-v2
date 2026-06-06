import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById, getEpisodes, getCover, getTitle, toSlug } from '../api/jikan';
import EpisodeList from '../components/EpisodeList';
import EpisodeServers from '../components/EpisodeServers';

export default function AnimePage() {
  const { id } = useParams(); // id = MAL ID
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSelectedEpisode(1);
    setEpisodes([]);

    Promise.all([
      getAnimeById(Number(id)),
      getEpisodes(Number(id), 1),
    ]).then(([animeData, epData]) => {
      setAnime(animeData);
      // epData is an array from Jikan
      const eps = Array.isArray(epData) ? epData : (epData?.data ?? []);
      setEpisodes(eps);
      setLoading(false);
    }).catch(() => setLoading(false));
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

  const totalEpisodes = anime.episodes || episodes.length || 12;
  const cover = getCover(anime);
  const title = getTitle(anime);
  const slug = toSlug(anime);
  const malId = anime.mal_id;

  // Current episode title from the list (if available)
  const currentEpInfo = episodes.find(e => e.mal_id === selectedEpisode);

  return (
    <div className="min-h-screen bg-[#0d1520] text-white pt-14">
      {/* Blurred banner from cover */}
      <div className="relative h-40 overflow-hidden">
        <img src={cover} alt="" className="w-full h-full object-cover opacity-15 blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1520]" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Anime Info */}
        <div className="flex gap-5 mb-8">
          <img
            src={cover}
            alt={title}
            className="w-28 h-40 object-cover rounded-lg shadow-xl flex-shrink-0 hidden sm:block border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black mb-1">{title}</h1>
            {anime.title_english && anime.title !== anime.title_english && (
              <p className="text-gray-500 text-sm mb-2">{anime.title}</p>
            )}

            {/* Meta badges */}
            <div className="flex gap-2 flex-wrap mb-3">
              {anime.score && (
                <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-0.5 rounded font-semibold">
                  ★ {anime.score}
                </span>
              )}
              <span className="bg-white/10 text-xs px-2 py-0.5 rounded capitalize">
                {anime.status?.toLowerCase().replace('finished airing', 'finished') || 'unknown'}
              </span>
              {anime.episodes && (
                <span className="bg-white/10 text-xs px-2 py-0.5 rounded">
                  {anime.episodes} eps
                </span>
              )}
              {anime.year && (
                <span className="text-gray-400 text-xs self-center">{anime.year}</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex gap-2 flex-wrap mb-3">
              {anime.genres?.slice(0, 5).map((g) => (
                <span key={g.name} className="bg-blue-900/40 border border-blue-800/40 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-gray-400 text-xs leading-relaxed line-clamp-4 max-w-2xl">
              {anime.synopsis}
            </p>
          </div>
        </div>

        {/* Player + Episode List */}
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-gray-400 text-xs">▶ Episode {selectedEpisode}</span>
              {currentEpInfo?.title && (
                <span className="text-gray-500 text-xs">— {currentEpInfo.title}</span>
              )}
              {currentEpInfo?.filler && (
                <span className="bg-orange-500/20 text-orange-300 text-xs px-1.5 py-0.5 rounded">Filler</span>
              )}
            </div>
            <EpisodeServers
              malId={malId}
              episode={selectedEpisode}
              slug={slug}
            />
          </div>

          <div className="w-full lg:w-72 flex-shrink-0">
            <EpisodeList
              totalEpisodes={totalEpisodes}
              episodes={episodes}
              selectedEpisode={selectedEpisode}
              onEpisodeSelect={setSelectedEpisode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
