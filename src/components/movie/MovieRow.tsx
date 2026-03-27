import { MovieCard } from '@/components/movie/MovieCard'
import type { Movie } from '@/types/movie'

interface MovieRowProps {
  movies: Movie[]
}

export const MovieRow = ({ movies }: MovieRowProps) => (
  <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-2">
    {movies.map((movie) => (
      <div key={movie.id} className="w-44 shrink-0">
        <MovieCard movie={movie} />
      </div>
    ))}
  </div>
)
