import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Panel, PanelHead } from '../BaseComponents'
import { SvgIcon } from '../SvgIcon'

export function Insights({ data }) {
  const { showToast } = useApp()
  const [question, setQuestion] = useState('')

  const overdue = data?.stats.overdueProjects ?? 0
  const active = data?.stats.activeProjects ?? 0
  const completed = data?.stats.completedProjects ?? 0
  const total = data?.stats.totalProjects ?? 0
  const rate = data?.stats.completionRate ?? 0

  const ask = (e) => {
    e.preventDefault()
    const q = question.trim()
    if (!q) return
    showToast(`Project insight: ${q}`)
    setQuestion('')
  }

  return (
    <Panel className="insights">
      <PanelHead>Project Insights</PanelHead>
      <div className="insights-row">
        
        <div className="insight-card risk">
          <h3>
            <span>⚠️</span> Attention
          </h3>
          <p>
            {overdue
              ? `${overdue} project${overdue === 1 ? '' : 's'} marked overdue need attention.`
              : 'No projects are currently marked overdue.'}
          </p>
          <button
            className="insight-link"
            onClick={() =>
              showToast(
                overdue
                  ? 'Review overdue projects from the Projects page.'
                  : 'Your current project schedule is on track.'
              )
            }
          >
            Review Projects <SvgIcon name="chevron" size={15} />
          </button>
        </div>

        
        <div className="insight-card forecast">
          <h3>
            <span>💡</span> Progress
          </h3>
          <p>
            {completed} completed of {total} project{total === 1 ? '' : 's'} — {rate}%
            completion rate.
          </p>
          <button
            className="insight-link"
            onClick={() =>
              showToast(
                `${active} active project${active === 1 ? '' : 's'} currently need progress updates.`
              )
            }
          >
            View Progress <SvgIcon name="chevron" size={15} />
          </button>
        </div>
      </div>

      
      <form className="chat-box" onSubmit={ask}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your projects..."
          aria-label="Ask about your projects"
        />
      </form>
    </Panel>
  )
}

function SelectSub({ children }) {
  return (
    <div className="sub-select">
      {children}
      <span>⌄</span>
    </div>
  )
}

export function Segmentation({ data }) {
  const stats = data?.stats || {}
  const total = stats.totalProjects || 0

  const rows = [
    ['todo', 'To do', stats.todo || 0],
    ['in_progress', 'In progress', stats.in_progress || 0],
    ['completed', 'Completed', stats.completed || 0],
    ['overdue', 'Overdue', stats.overdue || 0],
  ]

  const p1 = total ? Math.round(((stats.todo || 0) / total) * 100) : 0
  const p2 = total ? Math.round(((stats.in_progress || 0) / total) * 100) : 0
  const p3 = total ? Math.round(((stats.completed || 0) / total) * 100) : 0
  const p4 = Math.max(0, 100 - p1 - p2 - p3)

  return (
    <Panel>
      <PanelHead>Project Status</PanelHead>
      <SelectSub>Distribution by current status</SelectSub>
      <div className="seg-content">
        
        <div
          className="pie-chart project-status-pie"
          style={{
            background: `conic-gradient(#6531F7 0 ${p1}%, #f0b429 ${p1}% ${p1 + p2}%, #34c759 ${p1 + p2}% ${p1 + p2 + p3}%, #ff3b30 ${p1 + p2 + p3}% 100%)`,
          }}
          aria-hidden="true"
        />
        
        <div className="seg-list">
          {rows.map(([key, label, count]) => (
            <div key={key}>
              <i className={`dot ${key}`} />
              <span>{label}</span>
              <b>{total ? Math.round((count / total) * 100) : 0}%</b>
            </div>
          ))}
          <p>
            {total
              ? `${total} project${total === 1 ? '' : 's'} tracked for this account.`
              : 'Create a project to populate status distribution.'}
          </p>
        </div>
      </div>
    </Panel>
  )
}

export function Feature({ data }) {
  const stats = data?.stats || {}
  const total = stats.totalProjects || 0
  const rows = [
    ['todo', 'To do', stats.todo || 0],
    ['in_progress', 'In progress', stats.in_progress || 0],
    ['completed', 'Completed', stats.completed || 0],
    ['overdue', 'Overdue', stats.overdue || 0],
  ]

  return (
    <Panel>
      <PanelHead>Project Progress</PanelHead>
      <SelectSub>Current projects by status</SelectSub>
      <div className="feature-list">
        {rows.map(([key, name, v]) => {
          const pct = total ? Math.round((v / total) * 100) : 0
          return (
            <div className="feature-row" key={name}>
              <span>{name}</span>
              <em className={`count ${key}`}>{v}</em>
              <div className={`progress ${key}`} aria-label={`${name}: ${pct}%`}>
                <i style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <p className="panel-note">Progress is calculated from persisted project records.</p>
    </Panel>
  )
}

export function Nps({ data }) {
  const rate = data?.stats.completionRate ?? 0
  return (
    <Panel className="nps-panel">
      <PanelHead>Project Completion</PanelHead>
      <div className="nps-score">{rate}%</div>
      <div className="nps-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="nps-legend">
        <span>
          <i className="square green" />
          Completed <b>{data?.stats.completedProjects ?? 0}</b>
        </span>
        <span>
          <i className="square yellow" />
          Active <b>{data?.stats.activeProjects ?? 0}</b>
        </span>
        <span>
          <i className="square orange" />
          Overdue <b>{data?.stats.overdueProjects ?? 0}</b>
        </span>
      </div>
      <p className="panel-note">Completion rate is the percentage of your projects marked completed.</p>
    </Panel>
  )
}

export function Funnel({ data }) {
  const s = data?.stats || {}
  const rows = [
    ['To do', s.todo || 0],
    ['In progress', s.in_progress || 0],
    ['Completed', s.completed || 0],
    ['Overdue', s.overdue || 0],
  ]
  const max = Math.max(1, ...rows.map((r) => r[1]))

  return (
    <Panel>
      <PanelHead>Project Pipeline</PanelHead>
      <div className="subline">To do → In progress → Completed</div>
      <div className="funnel-wrap">
        <div className="funnel-shapes">
          {rows.map(([label, v]) => (
            <b key={label} style={{ width: `${52 + (v / max) * 48}%` }}>
              {v}
            </b>
          ))}
        </div>
        <div className="funnel-list">
          {rows.map(([label, v]) => (
            <div key={label}>
              {label}: {v}
            </div>
          ))}
          <p>Counts are live and scoped to the authenticated user.</p>
        </div>
      </div>
    </Panel>
  )
}

export function Sales({ data }) {
  const total = data?.stats.totalProjects ?? 0
  const active = data?.stats.activeProjects ?? 0
  const pct = total ? Math.round((active / total) * 100) : 0

  return (
    <Panel className="sales-panel">
      <PanelHead>Project Workload</PanelHead>
      <div className="sales-info">
        <strong>{active}</strong>
        <b>active projects</b>
        <span>{pct}% of total workload</span>
      </div>
      <svg
        className="sales-chart"
        viewBox="0 0 150 50"
        aria-hidden="true"
      >
        <path
          d={`M5 45 L30 ${45 - Math.min(35, pct * 0.35)} L55 ${45 - Math.min(35, pct * 0.5)} L80 ${45 - Math.min(35, pct * 0.65)} L105 ${45 - Math.min(35, pct * 0.8)} L130 ${45 - Math.min(35, pct * 0.9)} L145 ${45 - Math.min(35, pct)}`}
        />
      </svg>
      <p className="panel-note">
        Active means To do or In progress, matching the FRD dashboard definition.
      </p>
    </Panel>
  )
}

export function Tickets({ data }) {
  const s = data?.stats || {}
  const [tab, setTab] = useState('Live')

  const content =
    tab === 'Status'
      ? `To do ${s.todo ?? 0} · In progress ${s.in_progress ?? 0} · Completed ${s.completedProjects ?? 0} · Overdue ${s.overdueProjects ?? 0}`
      : tab === 'Due'
        ? `${s.overdueProjects ?? 0} overdue project${(s.overdueProjects ?? 0) === 1 ? '' : 's'} require${(s.overdueProjects ?? 0) === 1 ? 's' : ''} attention.`
        : `${s.activeProjects ?? 0} active · ${s.overdueProjects ?? 0} overdue`

  return (
    <Panel className="tickets-panel">
      <PanelHead>Project Attention</PanelHead>
      <div className="ticket-stats">
        <div>
          <b>{s.overdueProjects ?? 0}</b>
          <span>overdue</span>
        </div>
        <div>
          <b>{s.activeProjects ?? 0}</b>
          <span>active</span>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {['Live', 'Status', 'Due'].map((name) => (
          <button
            key={name}
            className={tab === name ? 'active' : ''}
            type="button"
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="ticket-tab-content">{content}</p>
      <p className="panel-note">
        Use the Projects page to review, update, or delete the records behind these dashboard
        numbers.
      </p>
    </Panel>
  )
}
