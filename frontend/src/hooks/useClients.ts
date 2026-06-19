import { useState, useEffect, useCallback } from 'react'
import type { Client } from '../types'
import type { ClientCreateData } from '../services/clientService'
import { getAllClients, createClient, deleteClient } from '../services/clientService'

// This describes exactly what the hook returns — a contract
interface UseClientsReturn {
  clients:     Client[]
  loading:     boolean
  error:       string | null
  clearError:  () => void
  addClient:   (data: ClientCreateData) => Promise<boolean>
  removeClient:(id: number) => Promise<boolean>
  refresh:     () => Promise<void>
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error,   setError  ] = useState<string | null>(null)

  // useCallback ensures fetchClients doesn't get recreated on every render
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllClients()
      setClients(data)
    } catch {
      setError('Failed to load clients. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  // Runs once when the hook is first used
  useEffect(() => {
    // schedule fetch on next macrotask to avoid calling setState synchronously within the effect
    const id = setTimeout(() => { void fetchClients() }, 0)
    return () => clearTimeout(id)
  }, [fetchClients])

  // Returns true on success, false on failure
  const addClient = async (data: ClientCreateData): Promise<boolean> => {
    try {
      const newClient = await createClient(data)
      setClients(prev => [newClient, ...prev])
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create client.'
      setError(message)
      return false
    }
  }

  const removeClient = async (id: number): Promise<boolean> => {
    try {
      await deleteClient(id)
      setClients(prev => prev.filter(c => c.id !== id))
      return true
    } catch {
      setError('Failed to delete client.')
      return false
    }
  }

  return {
    clients,
    loading,
    error,
    clearError: () => setError(null),
    addClient,
    removeClient,
    refresh: fetchClients,
  }
}