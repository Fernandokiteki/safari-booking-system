interface LoadingSpinnerProps {
  message?: string
}

function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="text-center py-5 text-muted">
      <div
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      />
      {message}
    </div>
  )
}

export default LoadingSpinner