import type { TravelPackage } from '../types'
import api from './api'

export interface PackageCreateData {
  name:          string
  destination:   string
  type:          'local' | 'international'
  duration_days: number
  price_kes:     number
  is_available:  boolean
  description:   string
}

export interface PackageUpdateData {
  name?:          string
  destination?:   string
  type?:          'local' | 'international'
  duration_days?: number
  price_kes?:     number
  is_available?:  boolean
  description?:   string
}

export const getAllPackages = async (): Promise<TravelPackage[]> => {
  const response = await api.get('/packages')
  return response.data
}

export const createPackage = async (data: PackageCreateData): Promise<TravelPackage> => {
  const response = await api.post('/packages', data)
  return response.data
}

export const updatePackage = async (id: number, data: PackageUpdateData): Promise<TravelPackage> => {
  const response = await api.put(`/packages/${id}`, data)
  return response.data
}

export const deletePackage = async (id: number): Promise<void> => {
  await api.delete(`/packages/${id}`)
}