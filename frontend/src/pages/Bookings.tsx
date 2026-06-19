import { useState } from 'react'
import type { BookingCreateData } from '../services/bookingService'  
import { useBookings } from '../hooks/useBookings'
import { useClients } from '../hooks/useClients'
import { usePackages } from '../hooks/usePackages'
import StatusBadge from '../components/ui/StatusBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'


const emptyForm: BookingCreateData = {
  client_id:     0,
  package_id:    0,
  travel_date:   '',
  num_travelers: 1,
  total_amount:  0,
  notes:         '',
}

const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed']

function Bookings() {
  const { bookings, loading, error, clearError, addBooking, editBooking, removeBooking } = useBookings()
  const { clients }  = useClients()
  const { packages } = usePackages()

  const [showForm,   setShowForm  ] = useState<boolean>(false)
  const [formData,   setFormData  ] = useState<BookingCreateData>(emptyForm)
  const [editStatus, setEditStatus] = useState<{ id: number; status: string } | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Auto-calculate total when package or num_travelers changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'client_id' || name === 'package_id' || name === 'num_travelers'
          ? Number(value)
          : value
      }
      // Auto-calculate total_amount when package or travelers change
      if (name === 'package_id' || name === 'num_travelers') {
        const selectedPackage = packages.find(p => p.id === Number(
          name === 'package_id' ? value : prev.package_id
        ))
        const travelers = name === 'num_travelers' ? Number(value) : prev.num_travelers
        if (selectedPackage) {
          updated.total_amount = selectedPackage.price_kes * travelers
        }
      }
      return updated
    })
  }

  function handleCancel() {
    setShowForm(false)
    setFormData(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const success = await addBooking(formData)
    if (success) handleCancel()
    setSubmitting(false)
  }

  async function handleStatusChange(id: number, status: string) {
    setEditStatus(null)
    await editBooking(id, { status })
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this booking?')) return
    await removeBooking(id)
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setShowForm(p => !p); setFormData(emptyForm) }}
        >
          {showForm ? 'Cancel' : '+ New Booking'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-dismissible mb-3">
          {error}
          <button className="btn-close" onClick={clearError} />
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3">New Booking</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Client</label>
                <select
                  name="client_id"
                  className="form-select form-select-sm"
                  value={formData.client_id || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">— Select a client —</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Package</label>
                <select
                  name="package_id"
                  className="form-select form-select-sm"
                  value={formData.package_id || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">— Select a package —</option>
                  {packages.filter(p => p.is_available).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — KES {Number(p.price_kes).toLocaleString('en-KE')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Travel Date</label>
                <input
                  name="travel_date"
                  type="date"
                  className="form-control form-control-sm"
                  value={formData.travel_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Travelers</label>
                <input
                  name="num_travelers"
                  type="number"
                  min="1"
                  className="form-control form-control-sm"
                  value={formData.num_travelers}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Total (KES)</label>
                <input
                  name="total_amount"
                  type="number"
                  className="form-control form-control-sm"
                  value={formData.total_amount}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">Auto-calculated from package price</small>
              </div>

              <div className="col-12">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Notes</label>
                <textarea
                  name="notes"
                  className="form-control form-control-sm"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Booking'}
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded shadow-sm p-4">
        {loading ? (
          <LoadingSpinner message="Loading bookings..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            message="No bookings yet."
            hint='Click "+ New Booking" to create the first one.'
          />
        ) : (
          <table className="table table-hover table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Package</th>
                <th>Travel Date</th>
                <th>Travelers</th>
                <th>Amount (KES)</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="text-muted">{booking.id}</td>
                  <td className="fw-medium">{booking.client.full_name}</td>
                  <td>
                    <div>{booking.package.name}</div>
                    <small className="text-muted">{booking.package.destination}</small>
                  </td>
                  <td>{new Date(booking.travel_date).toLocaleDateString('en-KE')}</td>
                  <td>{booking.num_travelers}</td>
                  <td>{Number(booking.total_amount).toLocaleString('en-KE')}</td>
                  <td>
                    {editStatus?.id === booking.id ? (
                      <select
                        className="form-select form-select-sm"
                        style={{ width: '130px' }}
                        value={editStatus.status}
                        onChange={e => handleStatusChange(booking.id, e.target.value)}
                        onBlur={() => setEditStatus(null)}
                        autoFocus
                      >
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span
                        style={{ cursor: 'pointer' }}
                        title="Click to change status"
                        onClick={() => setEditStatus({ id: booking.id, status: booking.status })}
                      >
                        <StatusBadge status={booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed'} />
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm py-0"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Bookings