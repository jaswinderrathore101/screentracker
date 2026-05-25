import { Link, useLocation } from 'react-router-dom'

type LocationState = {
  reason?: string
}

export function UnauthorizedPage() {
  const { state } = useLocation()
  const reason = (state as LocationState | null)?.reason ?? 'You are not authorized to access this area.'

  return (
    <main className="screen">
      <section className="card">
        <h1>Access denied</h1>
        <p className="error">{reason}</p>
        <div className="actions">
          <Link to="/login" className="linkButton">
            Go to sign in
          </Link>
        </div>
      </section>
    </main>
  )
}
