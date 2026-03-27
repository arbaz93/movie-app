interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => (
  <label className="relative block w-full max-w-xl" aria-label="Search movies">
    <span className="sr-only">Search movies</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search movies, cast, genres..."
      className="h-11 w-full rounded-full border border-slate-700 bg-slate-900/85 px-4 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
    />
    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
      ⌕
    </span>
  </label>
)
