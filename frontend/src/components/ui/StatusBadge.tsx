type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed'

interface StatusBadgeProps {
  status: Status
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending:   { label: 'Pending',   className: 'bg-warning text-dark' },
  confirmed: { label: 'Confirmed', className: 'bg-success'           },
  cancelled: { label: 'Cancelled', className: 'bg-danger'            },
  completed: { label: 'Completed', className: 'bg-primary'           },
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge