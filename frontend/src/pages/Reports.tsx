import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useReports } from '../hooks/useReports'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Colours for the pie chart slices
const STATUS_COLORS: Record<string, string> = {
  confirmed: '#198754',
  pending:   '#ffc107',
  cancelled: '#dc3545',
  completed: '#0d6efd',
}

// Format large numbers on chart axes
const formatKES = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
      <small>{message}</small>
    </div>
  )
}

function Reports() {
  const { data, loading, error } = useReports()

  if (loading) return <LoadingSpinner message="Loading reports..." />

  if (error) return (
    <div className="alert alert-danger">{error}</div>
  )

  if (!data) return null

  const hasMonthly  = data.monthly_revenue.length > 0
  const hasStatus   = data.status_breakdown.length > 0
  const hasType     = data.type_breakdown.length > 0
  const hasPackages = data.top_packages.length > 0

  return (
    <div>
      <p className="text-muted mb-4">
        Analytics overview — based on all bookings in the system.
      </p>

      {/* Row 1: Revenue Trend + Status Breakdown */}
      <div className="row g-4 mb-4">

        {/* Revenue Trend */}
        <div className="col-lg-7">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-1">Revenue Trend</h6>
            <small className="text-muted d-block mb-3">
              Monthly revenue from bookings (KES)
            </small>
            <div style={{ height: '260px' }}>
              {!hasMonthly ? (
                <EmptyChart message="No booking data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly_revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tickFormatter={formatKES}
                      tick={{ fontSize: 11 }}
                      width={55}
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            const num = Number(value) || 0
                            return name === 'Revenue (KES)'
                            ? [`KES ${num.toLocaleString('en-KE')}`, 'Revenue']
                            : [num, 'Bookings']
                        }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0d6efd"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Revenue (KES)"
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#198754"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Bookings"
                      yAxisId={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="col-lg-5">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-1">Bookings by Status</h6>
            <small className="text-muted d-block mb-3">
              Distribution across all booking statuses
            </small>
            <div style={{ height: '260px' }}>
              {!hasStatus ? (
                <EmptyChart message="No booking data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.status_breakdown}
                      dataKey="count"
                      nameKey="status"
                      cx="45%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${String(name)} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={true}
                    >
                      {data.status_breakdown.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLORS[entry.status] ?? '#6c757d'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                    formatter={(value) => [Number(value) || 0, 'Bookings']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Local vs International + Top Packages */}
      <div className="row g-4">

        {/* Local vs International */}
        <div className="col-lg-5">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-1">Local vs International</h6>
            <small className="text-muted d-block mb-3">
              Bookings and revenue by travel type
            </small>
            <div style={{ height: '260px' }}>
              {!hasType ? (
                <EmptyChart message="No booking data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.type_breakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                    formatter={(value, name) => {
                        const num = Number(value) || 0
                        return name === 'revenue'
                        ? [`KES ${num.toLocaleString('en-KE')}`, 'Revenue']
                        : [num, 'Bookings']
                    }}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Bookings"
                      fill="#0dcaf0"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Top Packages */}
        <div className="col-lg-7">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-1">Top Packages</h6>
            <small className="text-muted d-block mb-3">
              Most booked packages by number of bookings
            </small>
            <div style={{ height: '260px' }}>
              {!hasPackages ? (
                <EmptyChart message="No booking data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.top_packages}
                    layout="vertical"
                    margin={{ left: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      allowDecimals={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={130}
                    />
                    <Tooltip
                        formatter={(value) => [Number(value) || 0, 'Bookings']}
                    />
                    <Bar
                      dataKey="bookings"
                      name="Bookings"
                      fill="#f0a500"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Reports