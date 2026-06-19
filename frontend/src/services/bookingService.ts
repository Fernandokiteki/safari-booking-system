import type { Booking } from '../types'
import api from './api'

export interface BookingCreateData {
  client_id:     number
  package_id:    number
  travel_date:   string
  num_travelers: number
  total_amount:  number
  notes:         string
}

export interface BookingUpdateData {
  status?:        string
  travel_date?:   string
  num_travelers?: number
  total_amount?:  number
  notes?:         string
}

export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings')
  return response.data
}

export const createBooking = async (data: BookingCreateData): Promise<Booking> => {
  const response = await api.post('/bookings', data)
  return response.data
}

export const updateBooking = async (id: number, data: BookingUpdateData): Promise<Booking> => {
  const response = await api.put(`/bookings/${id}`, data)
  return response.data
}

export const deleteBooking = async (id: number): Promise<void> => {
  await api.delete(`/bookings/${id}`)
}