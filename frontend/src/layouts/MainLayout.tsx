import { Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  )
}