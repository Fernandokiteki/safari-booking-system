import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Packages from './pages/Packages'
import Bookings from './pages/Bookings'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — no auth needed */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes — redirects to /login if not authenticated */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index           element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="clients"  element={<Clients />} />
          <Route path="packages" element={<Packages />} />
          <Route path="reports"  element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App