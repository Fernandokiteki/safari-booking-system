export interface Client {
  id:          number
  full_name:   string
  email:       string
  phone:       string
  nationality: string
  created_at:  string
}

export interface TravelPackage {
  id:            number
  name:          string
  destination:   string
  type:          'local' | 'international'
  duration_days: number
  price_kes:     number
  is_available:  boolean
  description:   string | null
  created_at:    string
}

export interface Booking {
  id:            number
  client_id:     number
  package_id:    number
  status:        'pending' | 'confirmed' | 'cancelled' | 'completed'
  travel_date:   string
  num_travelers: number
  total_amount:  number
  notes:         string | null
  created_at:    string
  client:  { id: number; full_name: string }
  package: { id: number; name: string; destination: string }
}