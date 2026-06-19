import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — runs before EVERY API call
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('safari_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — runs after EVERY API response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If any request gets a 401, clear auth and reload to login
    if (error.response?.status === 401) {
      localStorage.removeItem('safari_token')
      localStorage.removeItem('safari_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
