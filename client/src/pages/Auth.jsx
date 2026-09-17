import { useState } from 'react'
import { api } from '../api'
import { Logo } from '../components/BaseComponents'

export function Landing({ navigate }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo />
          <b>Flowly</b>
        </div>
        <h1>Project management, simplified</h1>
        <p>Track projects, monitor progress, and keep your dashboard backed by real data.</p>
        <div className="landing-actions">
          <button className="primary" onClick={() => navigate('/login')}>
            Sign in
          </button>
          <button className="secondary-btn" onClick={() => navigate('/register')}>
            Create account
          </button>
        </div>
      </div>
    </div>
  )
}

export function AuthPage({ mode, onAuth, navigate }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  const submit = async (e) => {
    e.preventDefault()

    const next = {}
    if (isRegister && form.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }
    if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }

    if (Object.keys(next).length) return setErrors(next)

    setLoading(true)
    setError('')
    setErrors({})

    try {
      const r = isRegister
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password })

      onAuth(r.user)
    } catch (e) {
      setError(e.message)
      setErrors(e.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo />
          <b>Flowly</b>
        </div>
        <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        <p>
          {isRegister
            ? 'Start managing your projects.'
            : 'Sign in to continue to your dashboard.'}
        </p>
        <form onSubmit={submit} noValidate>
          {isRegister && (
            <label>
              Name
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <small>{errors.name}</small>}
            </label>
          )}

          <label>
            Email
            <input
              autoFocus={!isRegister}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={!!errors.email}
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label>
            Password
            <input
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-invalid={!!errors.password}
            />
            {errors.password && <small>{errors.password}</small>}
          </label>

          {error && (
            <div className="inline-error" role="alert">
              {error}
            </div>
          )}

          <button className="primary auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button className="auth-link" onClick={() => navigate(isRegister ? '/login' : '/register')}>
          {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  )
}
