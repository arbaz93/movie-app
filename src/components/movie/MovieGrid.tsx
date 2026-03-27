import { MovieCard } from '@/components/movie/MovieCard'
import type { Movie } from '@/types/movie'

interface MovieGridProps {
  movies: Movie[]
}
export const MovieGrid = ({ movies }: MovieGridProps) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </div>
)
