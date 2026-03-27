import { Suspense } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-200">
            Loading application...
          </div>
        }
      >
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
