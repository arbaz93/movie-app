import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'

export const AppLayout = () => (
  <div className="min-h-screen bg-transparent">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <Outlet />
    </main>
  </div>
)
