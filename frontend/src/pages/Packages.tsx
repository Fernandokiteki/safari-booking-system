import { useState } from 'react'
import type { TravelPackage } from '../types'
import type { PackageCreateData } from '../services/packageService'
import { usePackages } from '../hooks/usePackages'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

const emptyForm: PackageCreateData = {
  name:          '',
  destination:   '',
  type:          'local',
  duration_days: 1,
  price_kes:     0,
  is_available:  true,
  description:   '',
}

type FilterType = 'all' | 'local' | 'international'

function Packages() {
  const { packages, loading, error, clearError, addPackage, editPackage, removePackage } = usePackages()
  const [showForm,    setShowForm  ] = useState<boolean>(false)
  const [formData,    setFormData  ] = useState<PackageCreateData>(emptyForm)
  const [submitting,  setSubmitting] = useState<boolean>(false)
  const [editingId,   setEditingId ] = useState<number | null>(null)
  const [filter,      setFilter    ] = useState<FilterType>('all')

  // Filter packages by type
  const filtered = packages.filter(p =>
    filter === 'all' ? true : p.type === filter
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'duration_days' || name === 'price_kes'
        ? Number(value)
        : value
    }))
  }

  function handleEdit(pkg: TravelPackage) {
    setEditingId(pkg.id)
    setFormData({
      name:          pkg.name,
      destination:   pkg.destination,
      type:          pkg.type,
      duration_days: pkg.duration_days,
      price_kes:     pkg.price_kes,
      is_available:  pkg.is_available,
      description:   pkg.description ?? '',
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setFormData(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const success = editingId
      ? await editPackage(editingId, formData)
      : await addPackage(formData)
    if (success) handleCancel()
    setSubmitting(false)
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this package? This cannot be undone.')) return
    await removePackage(id)
  }

  async function handleToggleAvailability(pkg: TravelPackage) {
    await editPackage(pkg.id, { is_available: !pkg.is_available })
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          {(['all', 'local', 'international'] as FilterType[]).map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setShowForm(prev => !prev); setEditingId(null); setFormData(emptyForm) }}
        >
          {showForm && !editingId ? 'Cancel' : '+ Add Package'}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="alert alert-danger alert-dismissible mb-3" role="alert">
          {error}
          <button className="btn-close" onClick={clearError} />
        </div>
      )}

      {/* Form — used for both create and edit */}
      {showForm && (
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3">
            {editingId ? 'Edit Package' : 'New Package'}
          </h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Package Name</label>
                <input
                  name="name" type="text"
                  className="form-control form-control-sm"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maasai Mara Safari"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Destination</label>
                <input
                  name="destination" type="text"
                  className="form-control form-control-sm"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Maasai Mara, Kenya"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Type</label>
                <select
                  name="type"
                  className="form-select form-select-sm"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="local">Local</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Duration (days)</label>
                <input
                  name="duration_days" type="number" min="1"
                  className="form-control form-control-sm"
                  value={formData.duration_days}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Price (KES)</label>
                <input
                  name="price_kes" type="number" min="1" step="0.01"
                  className="form-control form-control-sm"
                  value={formData.price_kes}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Description</label>
                <textarea
                  name="description"
                  className="form-control form-control-sm"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the package..."
                  rows={2}
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    name="is_available"
                    type="checkbox"
                    className="form-check-input"
                    id="is_available"
                    checked={formData.is_available}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="is_available" style={{ fontSize: '13px' }}>
                    Available for booking
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Package' : 'Save Package'}
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Packages Table */}
      <div className="bg-white rounded shadow-sm p-4">
        {loading ? (
          <LoadingSpinner message="Loading packages..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            message="No packages found."
            hint={filter !== 'all' ? `No ${filter} packages yet.` : 'Click "+ Add Package" to create one.'}
          />
        ) : (
          <table className="table table-hover table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Destination</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Price (KES)</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(pkg => (
                <tr key={pkg.id}>
                  <td className="text-muted">{pkg.id}</td>
                  <td className="fw-medium">{pkg.name}</td>
                  <td>{pkg.destination}</td>
                  <td>
                    <span className={`badge ${pkg.type === 'local' ? 'bg-info text-dark' : 'bg-primary'}`}>
                      {pkg.type}
                    </span>
                  </td>
                  <td>{pkg.duration_days}d</td>
                  <td>{Number(pkg.price_kes).toLocaleString('en-KE')}</td>
                  <td>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={pkg.is_available}
                        onChange={() => handleToggleAvailability(pkg)}
                        title={pkg.is_available ? 'Click to disable' : 'Click to enable'}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-secondary btn-sm py-0"
                        onClick={() => handleEdit(pkg)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm py-0"
                        onClick={() => handleDelete(pkg.id)}
                      >
                        Delete
                      </button>
                    </div>
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

export default Packages