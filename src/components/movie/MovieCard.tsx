import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import type { Movie } from '@/types/movie'
import { formatRating } from '@/utils/format'

interface MovieCardProps {
  movie: Movie
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate()
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const favorites = useAppStore((state) => state.favorites)
  const setSelectedMovieId = useAppStore((state) => state.setSelectedMovieId)
  const isFavorite = favorites.includes(movie.id)

  const openPlayer = () => {
    setSelectedMovieId(movie.id)
    navigate(`/player/${movie.id}`)
  }
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900/80 shadow-lg shadow-black/20"
    >
      <button
        type="button"
        onClick={openPlayer}
        className="block w-full cursor-pointer text-left"
        aria-label={`Play ${movie.title}`}
      >
        <img src={movie.posterUrl} alt={`${movie.title} poster`} className="aspect-[2/3] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm font-semibold text-slate-100">{movie.title}</p>
          <p className="text-xs text-slate-300">⭐ {formatRating(movie.rating)}</p>
        </div>
      </button>
      <button
        type="button"
        aria-label={`Add ${movie.title} to watchlist`}
        onClick={() => toggleFavorite(movie.id)}
        className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2 py-1 text-xs text-slate-100"
      >
        {isFavorite ? '✓' : '+'}
      </button>
    </motion.article>
  )
}
