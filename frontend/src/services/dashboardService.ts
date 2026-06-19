import type { Booking } from '../types'
import api from './api'

export interface DashboardStats {
  total_bookings:  number
  total_clients:   number
  total_packages:  number
  total_revenue:   number
  recent_bookings: Booking[]
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats')
  return response.data
}