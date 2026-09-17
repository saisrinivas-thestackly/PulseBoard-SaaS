
export function ProfilePanel({ user, onLogout, onClose }) {
  return (
    <>
      <div className="profile-panel">
        <div className="profile-avatar">F</div>
        <div className="profile-details">
          <h3>{user?.name || 'User'}</h3>
          <p>{user?.email || ''}</p>
          <span>Authenticated PulseBoard account</span>
        </div>
      </div>
      <div className="profile-actions">
        <button className="secondary-btn" onClick={onClose}>
          Close
        </button>
        <button className="danger-btn" onClick={onLogout}>
          Log out
        </button>
      </div>
    </>
  )
}

export function Settings({ user, dark, setDark, onLogout }) {
  return (
    <div className="page-panel settings-page">
      <h1>Settings</h1>
      <p>Account and dashboard preferences.</p>

      <div className="settings-card">
        <h2>Account</h2>
        <div>
          <b>{user?.name}</b>
          <span>{user?.email}</span>
        </div>
      </div>

      <div className="settings-card">
        <h2>Appearance</h2>
        <label className="switch-row">
          <span>Dark mode</span>
          <input
            type="checkbox"
            checked={dark}
            onChange={(e) => setDark(e.target.checked)}
            aria-label="Dark mode"
          />
        </label>
      </div>

      <button className="danger-btn" onClick={onLogout}>
        Log out
      </button>
    </div>
  )
}

export function PlaceholderPage({ title }) {
  return (
    <div className="page-panel">
      <h1>{title}</h1>
      <p>This section follows the reference dashboard navigation. Project analytics and management are available in Dashboard and Projects.</p>
      <div className="empty-state large">No additional data configured for this section.</div>
    </div>
  )
}
