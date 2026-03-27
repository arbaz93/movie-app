import { startTransition, useEffect, useState, useDeferredValue } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SearchInput } from '@/components/ui/SearchInput'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAppStore } from '@/store/useAppStore'

export const Navbar = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const searchQuery = useAppStore((state) => state.searchQuery)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)
  const [inputValue, setInputValue] = useState(searchQuery)
  const deferredInputValue = useDeferredValue(inputValue)
  const debouncedInputValue = useDebouncedValue(deferredInputValue, 350)

  useEffect(() => {
    const queryFromUrl = searchParams.get('q') ?? ''
    setInputValue(queryFromUrl)
    setSearchQuery(queryFromUrl)
  }, [searchParams, setSearchQuery])

  useEffect(() => {
    if (location.pathname !== '/browse') {
      return
    }
    const currentQuery = searchParams.get('q') ?? ''
    if (debouncedInputValue === currentQuery) {
      return
    }
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (debouncedInputValue.trim()) {
        params.set('q', debouncedInputValue.trim())
      } else {
        params.delete('q')
      }
      navigate(`/browse?${params.toString()}`, { replace: true })
      setSearchQuery(debouncedInputValue.trim())
    })
  }, [debouncedInputValue, location.pathname, navigate, searchParams, setSearchQuery])

  const onInputChange = (value: string) => {
    setInputValue(value)
    if (location.pathname !== '/browse') {
      navigate('/browse')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/80 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => navigate('/browse')}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold tracking-wide text-white transition hover:bg-red-500"
          aria-label="Go to browse page"
        >
          StreamBox
        </button>
        <div className="flex-1">
          <SearchInput value={inputValue} onChange={onInputChange} />
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500"
          aria-label="Open profile menu"
        >
          Profile
        </button>
      </div>
    </header>
  )
}
