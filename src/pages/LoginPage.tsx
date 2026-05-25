import { type FormEvent, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const { signIn, registerCleaner, user, hasFirebaseConfig } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [mode, setMode] = useState<'sign-in' | 'register'>('sign-in')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    if (submitting || !email || !password) {
      return false
    }

    if (mode === 'register' && !displayName) {
      return false
    }

    return true
  }, [displayName, email, mode, password, submitting])

  if (user) {
    return <Navigate to="/app" replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (mode === 'sign-in') {
        await signIn(email, password)
      } else {
        await registerCleaner(email, password, displayName)
      }
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Authentication failed.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="screen">
      <section className="card">
        <h1>ScreenTracker</h1>
        <p className="subtitle">Staff attendance foundation (Step 1)</p>
        {!hasFirebaseConfig ? (
          <div className="alert">
            Firebase configuration is missing. Add .env.development values before using auth.
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {mode === 'register' ? (
            <>
              <label htmlFor="displayName">Display name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
              />
            </>
          ) : null}

          <button disabled={!canSubmit || !hasFirebaseConfig} type="submit">
            {submitting ? 'Please wait...' : mode === 'sign-in' ? 'Sign in' : 'Create cleaner account'}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => setMode(mode === 'sign-in' ? 'register' : 'sign-in')}
            disabled={submitting || !hasFirebaseConfig}
          >
            {mode === 'sign-in' ? 'Need a test cleaner account?' : 'Already have an account? Sign in'}
          </button>

          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>
    </main>
  )
}
