import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { SvgIcon } from './SvgIcon'

export function Topbar({ onProfile, onTheme, dark, onMenu }) {
  const { showToast, navigate } = useApp()
  const [query, setQuery] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/projects?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu">
        <SvgIcon name="grid" size={20} />
      </button>

      <form className="search" onSubmit={submit} role="search">
        <SvgIcon name="search" />
        <input
          aria-label="Search projects"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
        />
      </form>

      <div className="top-actions">
        <button
          className="theme"
          onClick={onTheme}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <SvgIcon name="sun" />
          <SvgIcon name="moon" />
        </button>

        <button onClick={() => showToast('No new notifications')} aria-label="Notifications">
          <SvgIcon name="bell" />
        </button>

        <button
          className="ai-round"
          onClick={() => showToast('AI Insight Hub is ready for your project insights.')}
          aria-label="AI Insight Hub"
        >
          <SvgIcon name="bot" />
        </button>

        <button className="avatar" onClick={onProfile} aria-label="Open profile">
          F
        </button>
      </div>
    </header>
  )
}
