import api from './api'

export interface MonthlyRevenue {
  month:    string
  revenue:  number
  bookings: number
}

export interface StatusBreakdown {
  status: string
  count:  number
}

export interface TypeBreakdown {
  type:    string
  count:   number
  revenue: number
}

export interface TopPackage {
  name:     string
  bookings: number
  revenue:  number
}

export interface ReportData {
  monthly_revenue:   MonthlyRevenue[]
  status_breakdown:  StatusBreakdown[]
  type_breakdown:    TypeBreakdown[]
  top_packages:      TopPackage[]
}

export const getReportData = async (): Promise<ReportData> => {
  const response = await api.get('/reports')
  return response.data
}