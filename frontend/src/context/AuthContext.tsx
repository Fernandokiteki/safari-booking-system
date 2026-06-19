import { createContext, useContext, useState, useEffect } from 'react'

interface AuthUser {
  name:  string
  email: string
}

interface AuthContextType {
  user:    AuthUser | null
  token:   string | null
  login:   (token: string, user: AuthUser) => void
  logout:  () => void
  isAuth:  boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('safari_token')
  )
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('safari_user')
    return stored ? JSON.parse(stored) : null
  })

  function login(newToken: string, newUser: AuthUser) {
    localStorage.setItem('safari_token', newToken)
    localStorage.setItem('safari_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  function logout() {
    localStorage.removeItem('safari_token')
    localStorage.removeItem('safari_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — any component can call useAuth() to get auth state
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}