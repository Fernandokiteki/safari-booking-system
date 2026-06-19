import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

interface LoginForm {
  email:    string
  password: string
}

function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [form,       setForm      ] = useState<LoginForm>({ email: '', password: '' })
  const [loading,    setLoading   ] = useState<boolean>(false)
  const [error,      setError     ] = useState<string | null>(null)
  const [showPass,   setShowPass  ] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/login', form)
      const { access_token, user_name, user_email } = response.data

      login(access_token, { name: user_name, email: user_email })
      navigate('/')
    } catch (err: unknown) {
      setError('Incorrect email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: '#f0f4f8' }}
    >
      <div className="w-100" style={{ maxWidth: '400px', padding: '0 16px' }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ width: '64px', height: '64px', backgroundColor: '#1a3c5e' }}
          >
            <span style={{ fontSize: '28px' }}>🦁</span>
          </div>
          <h4 className="fw-bold mb-0" style={{ color: '#1a3c5e' }}>Safari Booking System</h4>
          <small className="text-muted">Sign in to your account</small>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3 shadow-sm p-4">

          {error && (
            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium" style={{ fontSize: '13px' }}>
                Email address
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium" style={{ fontSize: '13px' }}>
                Password
              </label>
              <div className="input-group">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
              style={{ backgroundColor: '#1a3c5e', borderColor: '#1a3c5e' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted mt-3" style={{ fontSize: '12px' }}>
          Safari Travels Kenya · Business Management System
        </p>
      </div>
    </div>
  )
}

export default Login