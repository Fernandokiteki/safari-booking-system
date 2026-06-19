import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

// Map URL paths to human-readable page titles
const pageTitles: Record<string, string> = {
  '/':          'Dashboard',
  '/bookings':  'Bookings',
  '/clients':   'Clients',
  '/packages':  'Travel Packages',
  '/reports':   'Reports',
}

function Layout() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? 'Safari Booking System'

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>

      {/* Left: Sidebar */}
      <Sidebar />

      {/* Right: Main content area */}
      <div className="d-flex flex-column flex-grow-1 bg-light">
        <Navbar pageTitle={pageTitle} />

        {/* Page content renders here */}
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default Layout