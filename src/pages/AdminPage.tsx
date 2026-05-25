import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function AdminPage() {
  const { profile } = useAuth()

  return (
    <main className="screen">
      <section className="card">
        <h1>Supervisor/Admin Panel</h1>
        <p className="subtitle">Role-gated area. Current role: {profile?.role}</p>
        <p>
          This route is protected for <strong>supervisor</strong> and <strong>admin</strong> only.
        </p>
        <div className="actions">
          <Link to="/app" className="linkButton">
            Back to app home
          </Link>
        </div>
      </section>
    </main>
  )
}
