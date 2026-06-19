import { useState, useEffect } from 'react'
import type { DashboardStats } from '../services/dashboardService'
import { getDashboardStats } from '../services/dashboardService'

interface UseDashboardReturn {
  stats:   DashboardStats | null
  loading: boolean
  error:   string | null
}

export function useDashboard(): UseDashboardReturn {
  const [stats,   setStats  ] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error,   setError  ] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getDashboardStats()
        setStats(data)
      } catch {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { stats, loading, error }
}