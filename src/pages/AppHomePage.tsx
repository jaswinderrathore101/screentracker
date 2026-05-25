import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function AppHomePage() {
  const { profile, signOutCurrentUser } = useAuth()

  return (
    <main className="screen">
      <section className="card">
        <h1>Welcome, {profile?.displayName ?? 'Staff'}</h1>
        <p className="subtitle">Authenticated area (protected route)</p>

        <dl className="profileList">
          <div>
            <dt>Email</dt>
            <dd>{profile?.email}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{profile?.role}</dd>
          </div>
          <div>
            <dt>Active</dt>
            <dd>{profile?.active ? 'Yes' : 'No'}</dd>
          </div>
        </dl>

        <div className="actions">
          <Link to="/admin" className="linkButton">
            Open supervisor/admin panel
          </Link>
          <button type="button" className="secondary" onClick={() => void signOutCurrentUser()}>
            Sign out
          </button>
        </div>
      </section>
    </main>
  )
}
