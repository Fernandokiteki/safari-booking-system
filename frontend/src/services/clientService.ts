import api from './api'
import type { Client } from '../types'

// This is the shape of data we send TO the API when creating
export interface ClientCreateData {
  full_name: string
  email: string
  phone: string
  nationality: string
}

// Fetch all clients from the backend
export const getAllClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients')
  return response.data
}

// Create a new client
export const createClient = async (data: ClientCreateData): Promise<Client> => {
  const response = await api.post('/clients', data)
  return response.data
}

// Delete a client by id
export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`/clients/${id}`)
}