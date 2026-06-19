interface EmptyStateProps {
  message: string
  hint?: string
}

function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="text-center py-5 text-muted">
      <p className="mb-1">{message}</p>
      {hint && <small>{hint}</small>}
    </div>
  )
}

export default EmptyState