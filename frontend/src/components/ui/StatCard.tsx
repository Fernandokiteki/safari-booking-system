interface StatCardProps {
  label: string
  value: string | number
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger'
}

function StatCard({ label, value, color }: StatCardProps) {
  const borderColors: Record<string, string> = {
    primary: '#0d6efd',
    success:  '#198754',
    warning:  '#ffc107',
    info:     '#0dcaf0',
    danger:   '#dc3545',
  }

  return (
    <div
      className="bg-white rounded shadow-sm p-4"
      style={{ borderLeft: `4px solid ${borderColors[color]}` }}
    >
      <p className="text-muted mb-1" style={{ fontSize: '13px' }}>{label}</p>
      <h4 className="fw-bold mb-0">{value}</h4>
    </div>
  )
}

export default StatCard