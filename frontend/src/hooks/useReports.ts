import { useState, useEffect } from 'react'
import type { ReportData } from '../services/reportService'
import { getReportData } from '../services/reportService'

interface UseReportsReturn {
  data:    ReportData | null
  loading: boolean
  error:   string | null
}

export function useReports(): UseReportsReturn {
  const [data,    setData   ] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error,   setError  ] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const result = await getReportData()
        setData(result)
      } catch {
        setError('Failed to load report data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { data, loading, error }
}