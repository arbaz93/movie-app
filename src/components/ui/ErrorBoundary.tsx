import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: unknown) {
    // Keep a console report for debugging while showing a safe fallback UI.
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error', error)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-slate-100">
          <div>
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-slate-400">Please refresh the app and try again.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
