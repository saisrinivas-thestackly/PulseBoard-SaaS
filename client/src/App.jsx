import { useEffect, useState } from 'react'
import { api } from './api'
import { AppContext } from './context/AppContext'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Modal } from './components/BaseComponents'
import { Dashboard } from './pages/Dashboard'
import { Projects } from './pages/Projects'
import { Settings, ProfilePanel, PlaceholderPage } from './pages/Settings'
import { Landing, AuthPage } from './pages/Auth'
import { ProjectForm } from './pages/ProjectForm'

function DashboardProjectForm({ onSave, onCancel }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async (form) => {
    setSaving(true)
    setError('')
    try {
      await onSave(form)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {error && (
        <div className="inline-error" role="alert">
          {error}
        </div>
      )}
      <ProjectForm onSave={save} onCancel={onCancel} saving={saving} />
    </>
  )
}

export function App() {

  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [path, setPath] = useState(window.location.pathname || '/')

  const [dark, setDark] = useState(localStorage.getItem('pulse-theme') === 'dark')

  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const [toast, setToast] = useState('')

  useEffect(() => {
    api
      .me()
      .then((r) => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('pulse-theme', dark ? 'dark' : 'light')
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname)
      setNewProjectOpen(false)
      setMobileOpen(false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(id)
  }, [toast])

  const navigate = (href) => {
    window.history.pushState({}, '', href)
    setPath(window.location.pathname)
    setNewProjectOpen(false)
    setProfileOpen(false)
    setMobileOpen(false)
  }

  const authDone = (u) => {
    setUser(u)
    navigate('/dashboard')
  }

  const logout = async () => {
    try {
      await api.logout()
    } finally {
      setUser(null)
      navigate('/login')
    }
  }

  const openNewProject = () => {
    if (path !== '/dashboard') {
      window.history.pushState({}, '', '/dashboard')
      setPath('/dashboard')
      setMobileOpen(false)
    }
    setNewProjectOpen(true)
  }

  const createFromDashboard = async (form) => {
    try {
      await api.createProject(form)
      setNewProjectOpen(false)
      setRefreshKey((v) => v + 1)
      setToast('Project created successfully')
    } catch (e) {
      throw e
    }
  }

  const context = {
    navigate,
    path,
    showToast: setToast,
  }

  if (checking) {
    return (
      <div className="full-loading">
        <span className="spinner" />
        Loading...
      </div>
    )
  }

  if (!user) {
    return path === '/' ? (
      <Landing navigate={navigate} />
    ) : (
      <AuthPage
        mode={path === '/register' ? 'register' : 'login'}
        onAuth={authDone}
        navigate={navigate}
      />
    )
  }

  return (
    <AppContext.Provider value={context}>
      <div className="app-shell">
        
        <div className="background-effects">
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
          <span className="blob b4" />
          <span className="blob b5" />
        </div>

        <div className="app">
          
          {mobileOpen && (
            <button
              className="mobile-overlay"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            />
          )}

          
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          
          <main className="main">
            
            <Topbar
              onProfile={() => setProfileOpen(true)}
              onTheme={() => setDark((v) => !v)}
              dark={dark}
              onMenu={() => setMobileOpen(true)}
            />

            
            {path === '/projects' ? (
              <Projects initialQuery={new URLSearchParams(window.location.search).get('q') || ''} />
            ) : path === '/settings' ? (
              <Settings user={user} dark={dark} setDark={setDark} onLogout={logout} />
            ) : path === '/analytics' ? (
              <PlaceholderPage title="Customer Analytics" />
            ) : path === '/product' ? (
              <PlaceholderPage title="Product" />
            ) : path === '/sales' ? (
              <PlaceholderPage title="Sales & Funnel" />
            ) : path === '/integrations' ? (
              <PlaceholderPage title="Integrations" />
            ) : path === '/support' ? (
              <PlaceholderPage title="Support & Success" />
            ) : (
              <Dashboard onNewProject={openNewProject} refreshKey={refreshKey} />
            )}
          </main>
        </div>

        
        {toast && <div className="toast" role="status">{toast}</div>}

        
        {profileOpen && (
          <Modal
            title="Profile"
            onClose={() => setProfileOpen(false)}
          >
            <ProfilePanel
              user={user}
              onClose={() => setProfileOpen(false)}
              onLogout={logout}
            />
          </Modal>
        )}

        
        {newProjectOpen && (
          <Modal
            title="Create project"
            onClose={() => setNewProjectOpen(false)}
          >
            <DashboardProjectForm
              onSave={createFromDashboard}
              onCancel={() => setNewProjectOpen(false)}
            />
          </Modal>
        )}
      </div>
    </AppContext.Provider>
  )
}
