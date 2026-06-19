import { useState } from 'react'
import type { ClientCreateData } from '../services/clientService'
import { useClients } from '../hooks/useClients'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

const emptyForm: ClientCreateData = {
  full_name: '',
  email: '',
  phone: '',
  nationality: '',
}

function Clients() {
  const { clients, loading, error, clearError, addClient, removeClient } = useClients()
  const [showForm,   setShowForm  ] = useState<boolean>(false)
  const [formData,   setFormData  ] = useState<ClientCreateData>(emptyForm)
  const [submitting, setSubmitting] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const success = await addClient(formData)
    if (success) {
      setFormData(emptyForm)
      setShowForm(false)
    }
    setSubmitting(false)
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this client? This cannot be undone.')) return
    await removeClient(id)
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          {clients.length} client{clients.length !== 1 ? 's' : ''} registered
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? 'Cancel' : '+ Add Client'}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="alert alert-danger alert-dismissible mb-3" role="alert">
          {error}
          <button className="btn-close" onClick={clearError} />
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3">New Client</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {[
                { name: 'full_name',   label: 'Full Name',   type: 'text',  placeholder: 'e.g. Jane Muthoni'   },
                { name: 'email',       label: 'Email',       type: 'email', placeholder: 'jane@example.com'     },
                { name: 'phone',       label: 'Phone',       type: 'text',  placeholder: '+254712345678'        },
                { name: 'nationality', label: 'Nationality', type: 'text',  placeholder: 'e.g. Kenyan'          },
              ].map(field => (
                <div className="col-md-6" key={field.name}>
                  <label className="form-label fw-medium" style={{ fontSize: '13px' }}>
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    className="form-control form-control-sm"
                    value={formData[field.name as keyof ClientCreateData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Client'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => { setShowForm(false); setFormData(emptyForm) }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded shadow-sm p-4">
        {loading ? (
          <LoadingSpinner message="Loading clients..." />
        ) : clients.length === 0 ? (
          <EmptyState
            message="No clients yet."
            hint='Click "+ Add Client" to register your first one.'
          />
        ) : (
          <table className="table table-hover table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Nationality</th>
                <th>Registered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td className="text-muted">{client.id}</td>
                  <td className="fw-medium">{client.full_name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.nationality}</td>
                  <td className="text-muted" style={{ fontSize: '12px' }}>
                    {new Date(client.created_at).toLocaleDateString('en-KE')}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm py-0"
                      onClick={() => handleDelete(client.id)}
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

export default Clients