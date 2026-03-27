import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MovieRow } from '@/components/movie/MovieRow'
// import { VideoPlayer } from '@/components/player/VideoPlayer'
import { movieSources } from "@/utils/movieSources.ts";
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { movieService } from '@/features/movies/services/movieService'
import type { Movie } from '@/types/movie'
import { formatDate, formatDuration, formatRating } from '@/utils/format'

export default function PlayerPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [currentSrc, setCurrentSrc] = useState<string>(movieSources[0].src)
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const parsedId = Number(movieId)
    if (!parsedId) {
      navigate('/browse')
      return
    }

    let active = true
    // setLoading(true)

    Promise.all([movieService.fetchMovieById(parsedId), movieService.fetchSuggested(parsedId)])
      .then(([movieResponse, suggested]) => {
        if (!active) {
          return
        }
        setMovie(movieResponse)
        setSuggestedMovies(suggested)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [movieId, navigate])

  if (loading) {
    return <EmptyState title="Loading player..." description="Preparing movie stream and details." />
  }

  if (!movie) {
    return <EmptyState title="Movie not found" description="The movie does not exist or is unavailable." />
  }

  const setSource = (index:number) => {
    console.log(movieSources[index].src)
    setCurrentSrc(movieSources[index].src);
  }
  return (
    <section className="space-y-8">
      <iframe frameBorder={0} allowFullScreen={true  } className='w-full aspect-video' src={`${currentSrc}/${movieId}`} />
      {/*<VideoPlayer src={movie.videoUrl} poster={movie.backdropUrl} title={movie.title} />*/}
      <select onChange={(e) => setSource(e.target.selectedIndex)}>
        {movieSources.map((src:any, i:number) => <option key={i}>{src.name}</option>)}
      </select>
      <article className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
        <h1 className="text-2xl font-semibold text-slate-100 md:text-3xl">{movie.title}</h1>
        <p className="text-sm text-slate-300">{movie.description}</p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          <span>Release: {formatDate(movie.releaseDate)}</span>
          <span>Rating: {formatRating(movie.rating)}</span>
          <span>Duration: {formatDuration(movie.durationMinutes)}</span>
        </div>
      </article>

      <div>
        <SectionTitle title="Suggested Movies" subtitle="Because you watched this title" />
        {suggestedMovies.length === 0 ? (
          <EmptyState title="No suggestions right now" description="Try another movie to refresh recommendations." />
        ) : (
          <MovieRow movies={suggestedMovies} />
        )}
      </div>
    </section>
  )
}
