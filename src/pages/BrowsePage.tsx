import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { MovieGrid } from '@/components/movie/MovieGrid'
import { useMovieSections } from '@/features/movies/hooks/useMovieSections'
import { useSearchMovies } from '@/features/search/hooks/useSearchMovies'
import { useAppStore } from '@/store/useAppStore'

const sectionLabels = {
  trending: 'Trending Now',
  popular: 'Popular Picks',
  topRated: 'Top Rated',
} as const

export default function BrowsePage() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const [page, setPage] = useState(1)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)
  const { sectionMovies, loading: sectionLoading, error: sectionError, totalPages: sectionPages } =
    useMovieSections(page)
  const {
    searchResults,
    loading: searchLoading,
    error: searchError,
    totalPages: searchPages,
    debouncedQuery,
  } = useSearchMovies(query, page)

  useEffect(() => {
    setSearchQuery(query)
    setPage(1)
  }, [query, setSearchQuery])

  const isSearching = Boolean(debouncedQuery.trim())
  const loading = isSearching ? searchLoading : sectionLoading
  const error = isSearching ? searchError : sectionError
  const totalPages = isSearching ? searchPages : sectionPages

  return (
    <section className="space-y-8">
      {isSearching ? (
        <div className="space-y-4">
          <SectionTitle
            title={`Search Results: "${debouncedQuery}"`}
            subtitle={`${searchResults.length} results on page ${page}`}
          />
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : null}
          {!loading && error ? (
            <EmptyState title="Search unavailable" description={error} />
          ) : null}
          {!loading && !error && searchResults.length === 0 ? (
            <EmptyState
              title="No results found"
              description="Try a different keyword, title, or genre."
            />
          ) : null}
          {!loading && !error && searchResults.length > 0 ? <MovieGrid movies={searchResults} /> : null}
        </div>
      ) : (
        <>
          {(Object.keys(sectionMovies) as Array<keyof typeof sectionLabels>).map((category) => (
            <div key={category}>
              <SectionTitle title={sectionLabels[category]} subtitle={`Page ${page}`} />
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : null}
              {!loading && error ? <EmptyState title="Unable to load movies" description={error} /> : null}
              {!loading && !error ? <MovieGrid movies={sectionMovies[category]} /> : null}
            </div>
          ))}
        </>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-slate-300">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page >= totalPages}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  )
}
