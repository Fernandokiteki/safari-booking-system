import { useDashboard } from '../hooks/useDashboard'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function Dashboard() {
  const { stats, loading, error } = useDashboard()

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  if (error) return (
    <div className="alert alert-danger">{error}</div>
  )

  if (!stats) return null

  // Format revenue — show as "1.2M" or "450K" or exact amount
  const formatRevenue = (amount: number): string => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
    if (amount >= 1_000)     return `${(amount / 1_000).toFixed(0)}K`
    return amount.toLocaleString('en-KE')
  }

  const statCards = [
    { label: 'Total Bookings',  value: stats.total_bookings,            color: 'primary' as const },
    { label: 'Active Clients',  value: stats.total_clients,             color: 'success' as const },
    { label: 'Packages',        value: stats.total_packages,            color: 'warning' as const },
    { label: 'Revenue (KES)',   value: formatRevenue(stats.total_revenue), color: 'info' as const },
  ]

  return (
    <div>
      <p className="text-muted mb-4">Welcome back. Here is today's overview.</p>

      {/* Live stat cards */}
      <div className="row g-3 mb-4">
        {statCards.map(stat => (
          <div className="col-6 col-lg-3" key={stat.label}>
            <StatCard
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          </div>
        ))}
      </div>

      {/* Recent bookings — live from database */}
      <div className="bg-white rounded shadow-sm p-4">
        <h6 className="fw-bold mb-3">Recent Bookings</h6>

        {stats.recent_bookings.length === 0 ? (
          <p className="text-muted text-center py-3 mb-0">
            No bookings yet. Create one from the Bookings page.
          </p>
        ) : (
          <table className="table table-hover table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>Client</th>
                <th>Package</th>
                <th>Travel Date</th>
                <th>Amount (KES)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="fw-medium">{booking.client.full_name}</td>
                  <td>
                    <div>{booking.package.name}</div>
                    <small className="text-muted">{booking.package.destination}</small>
                  </td>
                  <td>
                    {new Date(booking.travel_date).toLocaleDateString('en-KE')}
                  </td>
                  <td>{Number(booking.total_amount).toLocaleString('en-KE')}</td>
                  <td>
                    <StatusBadge
                      status={booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed'}
                    />
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

export default Dashboard