import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { StatCard } from '../components/StatCard'
import { Revenue } from '../components/Charts/RevenueChart'
import { Insights, Segmentation, Feature, Nps, Funnel, Sales, Tickets } from '../components/Charts/DashboardPanels'
import { RecentActivity } from '../components/RecentActivity'
import { SvgIcon } from '../components/SvgIcon'

const fallbackStats = [
  { title: 'Total Projects', value: '0', badge: 'Live', tone: 'up', note: 'Total projects owned by your account' },
  { title: 'Active Projects', value: '0', badge: 'Live', tone: 'up', note: 'Projects currently in progress or to-do' },
  { title: 'Completed Projects', value: '0', badge: 'Live', tone: 'up', note: 'Projects marked completed' },
  { title: 'Overdue Projects', value: '0', badge: 'Live', tone: 'up', note: 'Projects marked overdue' },
  { title: 'Completion Rate', value: '0%', badge: 'Live', tone: 'up', note: 'Completed projects divided by total projects' },
]

export function Dashboard({ onNewProject, refreshKey }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setData(null)
    setError('')

    api.dashboard()
      .then((v) => mounted && setData(v))
      .catch((e) => {
        if (mounted) {
          setError(e.message)
          console.error('Dashboard load failed:', e)
        }
      })

    return () => {
      mounted = false
    }
  }, [refreshKey])

  const stats = useMemo(
    () =>
      data
        ? [
            { title: 'Total Projects', value: data.stats.totalProjects, badge: 'Live', tone: 'up', note: 'Total projects owned by your account' },
            { title: 'Active Projects', value: data.stats.activeProjects, badge: 'Live', tone: 'up', note: 'Projects currently in progress or to-do' },
            { title: 'Completed Projects', value: data.stats.completedProjects, badge: 'Live', tone: 'up', note: 'Projects marked completed' },
            { title: 'Overdue Projects', value: data.stats.overdueProjects, badge: 'Live', tone: 'up', note: 'Projects marked overdue' },
            { title: 'Completion Rate', value: `${data.stats.completionRate}%`, badge: 'Live', tone: 'up', note: 'Completed projects divided by total projects' },
          ]
        : fallbackStats,
    [data]
  )

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Live project analytics from your persisted data.</p>
        </div>
        <button className="primary action-btn" onClick={onNewProject}>
          <SvgIcon name="plus" size={17} /> New project
        </button>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <StatCard s={s} key={s.title} loading={!data && !error} error={error} />
        ))}
      </div>

      <div className="dashboard-grid">
        <Revenue data={data} error={error} />
        <Insights data={data} />
        <Segmentation data={data} />
        <Feature data={data} />
        <Nps data={data} />
        <Funnel data={data} />
        <Sales data={data} />
        <Tickets data={data} />
        <RecentActivity items={data?.recentActivity} loading={!data && !error} error={error} />
      </div>
    </>
  )
}
