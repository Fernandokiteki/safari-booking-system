import { useState, useEffect, useCallback } from 'react'
import type { Booking } from '../types'
import type { BookingCreateData, BookingUpdateData } from '../services/bookingService'
import { getAllBookings, createBooking, updateBooking, deleteBooking } from '../services/bookingService'

interface UseBookingsReturn {
  bookings:       Booking[]
  loading:        boolean
  error:          string | null
  clearError:     () => void
  addBooking:     (data: BookingCreateData) => Promise<boolean>
  editBooking:    (id: number, data: BookingUpdateData) => Promise<boolean>
  removeBooking:  (id: number) => Promise<boolean>
  refresh:        () => Promise<void>
}

export function useBookings(): UseBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading,  setLoading ] = useState<boolean>(true)
  const [error,    setError   ] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllBookings()
        setBookings(data)
      } catch {
        setError('Failed to load bookings. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllBookings()
      setBookings(data)
    } catch {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addBooking = async (data: BookingCreateData): Promise<boolean> => {
    try {
      const created = await createBooking(data)
      setBookings(prev => [created, ...prev])
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create booking.')
      return false
    }
  }

  const editBooking = async (id: number, data: BookingUpdateData): Promise<boolean> => {
    try {
      const updated = await updateBooking(id, data)
      setBookings(prev => prev.map(b => b.id === id ? updated : b))
      return true
    } catch {
      setError('Failed to update booking.')
      return false
    }
  }

  const removeBooking = async (id: number): Promise<boolean> => {
    try {
      await deleteBooking(id)
      setBookings(prev => prev.filter(b => b.id !== id))
      return true
    } catch {
      setError('Failed to delete booking.')
      return false
    }
  }

  return { bookings, loading, error, clearError: () => setError(null), addBooking, editBooking, removeBooking, refresh }
}