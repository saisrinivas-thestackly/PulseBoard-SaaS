import { useApp } from '../context/AppContext'
import { SvgIcon } from './SvgIcon'
import { Logo } from './BaseComponents'

const navGroups = [
  {
    title: 'MAIN',
    items: [
      ['grid', 'Dashboard', '/dashboard'],
      ['chart', 'Projects', '/projects'],
      ['user', 'Customer Analytics', '/analytics'],
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      ['bolt', 'Product', '/product'],
      ['pie', 'Sales & Funnel', '/sales'],
    ],
  },
  {
    title: 'SUPPORT',
    items: [
      ['gear', 'Settings', '/settings'],
      ['plug', 'Integrations', '/integrations'],
      ['chat', 'Support & Success', '/support'],
    ],
  },
]

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { navigate, path, showToast } = useApp()

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      aria-label="Primary navigation"
    >
      <div className="brand">
        <Logo onClick={collapsed ? () => setCollapsed(false) : undefined} />
        <div className="brand-copy">
          <b>Flowly</b>
          <small>Project Management Tool</small>
        </div>
        <button
          className="collapse-btn"
          onClick={() => {
            if (mobileOpen) {
              setMobileOpen(false)
              return
            }
            setCollapsed((v) => !v)
          }}
          aria-label={
            mobileOpen ? 'Close sidebar' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'
          }
        >
          <span>{mobileOpen ? '‹' : collapsed ? '›' : '‹'}</span>
        </button>
      </div>

      <div className="side-nav">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.title}>
            <div className="group-title">{group.title}</div>
            {group.items.map(([icon, label, href]) => (
              <button
                key={label}
                className={`nav-item ${path === href ? 'active' : ''}`}
                title={collapsed ? label : undefined}
                aria-current={path === href ? 'page' : undefined}
                onClick={() => {
                  navigate(href)
                  if (!['/dashboard', '/projects', '/settings'].includes(href)) {
                    showToast(`${label} is available as a design section.`)
                  }
                }}
              >
                <span className="nav-icon">
                  <SvgIcon name={icon} />
                </span>
                <span className="nav-label">{label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <button
        className="ai-hub"
        onClick={() => showToast('AI Insight Hub is ready for your project insights.')}
        aria-label="Open AI Insight Hub"
      >
        <SvgIcon name="bot" />
        <span>AI Insight Hub</span>
      </button>
    </aside>
  )
}
