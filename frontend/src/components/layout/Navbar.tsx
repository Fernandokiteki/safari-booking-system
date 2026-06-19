import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  pageTitle: string
}

function Navbar({ pageTitle }: NavbarProps) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom shadow-sm">
      <h6 className="mb-0 fw-bold text-dark">{pageTitle}</h6>

      <div className="d-flex align-items-center gap-3">
        <span className="badge bg-success">System Online</span>

        <div className="text-end">
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {user?.name ?? 'Admin'}
          </div>
          <div className="text-muted" style={{ fontSize: '12px' }}>
            {user?.email ?? ''}
          </div>
        </div>

        <div
          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
          style={{ width: '36px', height: '36px', fontSize: '14px' }}
        >
          {user?.name?.charAt(0).toUpperCase() ?? 'A'}
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleLogout}
          title="Sign out"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

export default Navbar