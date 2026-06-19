import { NavLink } from 'react-router-dom'

// Each nav item has a label and a path
const navItems = [
  { label: 'Dashboard',  path: '/' },
  { label: 'Bookings',   path: '/bookings' },
  { label: 'Clients',    path: '/clients' },
  { label: 'Packages',   path: '/packages' },
  { label: 'Reports',    path: '/reports' },
]

function Sidebar() {
  return (
    <aside className="d-flex flex-column p-3 text-white"
      style={{ width: '240px', minHeight: '100vh', backgroundColor: '#1a3c5e' }}>

      {/* Agency Brand */}
      <div className="mb-4 text-center border-bottom border-secondary pb-3">
        <h5 className="fw-bold mb-0" style={{ color: '#f0a500' }}>🦁 Safari</h5>
        <small style={{ color: '#a0bcd4', fontSize: '11px' }}>
          BOOKING MANAGEMENT
        </small>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `d-block py-2 px-3 mb-1 rounded text-decoration-none fw-medium ` +
              (isActive
                ? 'text-white'
                : 'text-secondary')
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#f0a500' : 'transparent',
              transition: 'background-color 0.2s',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-top border-secondary pt-3 mt-3">
        <small style={{ color: '#a0bcd4' }}>Safari Travels Kenya</small>
      </div>
    </aside>
  )
}

export default Sidebar