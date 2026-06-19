import { useState, useEffect, useCallback } from 'react'
import type { TravelPackage } from '../types'
import type { PackageCreateData, PackageUpdateData } from '../services/packageService'
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../services/packageService'

interface UsePackagesReturn {
  packages:      TravelPackage[]
  loading:       boolean
  error:         string | null
  clearError:    () => void
  addPackage:    (data: PackageCreateData) => Promise<boolean>
  editPackage:   (id: number, data: PackageUpdateData) => Promise<boolean>
  removePackage: (id: number) => Promise<boolean>
  refresh:       () => Promise<void>
}

export function usePackages(): UsePackagesReturn {
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading,  setLoading ] = useState<boolean>(true)
  const [error,    setError   ] = useState<string | null>(null)

  // ✅ async function defined INSIDE the effect — avoids cascading render warning
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllPackages()
        setPackages(data)
      } catch {
        setError('Failed to load packages. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])   // empty array = run once on mount only

  // Separate refresh function for manual re-fetching from the page
  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllPackages()
      setPackages(data)
    } catch {
      setError('Failed to load packages.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPackage = async (data: PackageCreateData): Promise<boolean> => {
    try {
      const created = await createPackage(data)
      setPackages(prev => [created, ...prev])
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create package.')
      return false
    }
  }

  const editPackage = async (id: number, data: PackageUpdateData): Promise<boolean> => {
    try {
      const updated = await updatePackage(id, data)
      setPackages(prev => prev.map(p => p.id === id ? updated : p))
      return true
    } catch {
      setError('Failed to update package.')
      return false
    }
  }

  const removePackage = async (id: number): Promise<boolean> => {
    try {
      await deletePackage(id)
      setPackages(prev => prev.filter(p => p.id !== id))
      return true
    } catch {
      setError('Failed to delete package.')
      return false
    }
  }

  return {
    packages,
    loading,
    error,
    clearError: () => setError(null),
    addPackage,
    editPackage,
    removePackage,
    refresh,
  }
}