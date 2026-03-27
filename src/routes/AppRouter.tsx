import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

const BrowsePage = lazy(() => import('@/pages/BrowsePage'))
const PlayerPage = lazy(() => import('@/pages/PlayerPage'))

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/browse" replace />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/player/:movieId" element={<PlayerPage />} />
        <Route path="*" element={<Navigate to="/browse" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
