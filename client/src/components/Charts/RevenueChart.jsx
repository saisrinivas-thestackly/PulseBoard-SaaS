import { Panel, PanelHead, LoadingState } from '../BaseComponents'

function RevenueChartSvg({ points }) {
  const source = Array.isArray(points) ? points : []
  const validSource = source.filter(
    (p) => p && Number.isFinite(Number(p.created)) && Number.isFinite(Number(p.completed))
  )

  if (!validSource.length) {
    return <div className="chart-empty">No project activity yet</div>
  }

  const w = 700,
    h = 250,
    left = 42,
    right = 12,
    top = 24,
    bottom = 36
  const max = Math.max(1, ...validSource.map((p) => Math.max(Number(p.created), Number(p.completed))))
  const groupW = (w - left - right) / validSource.length
  const x = (i) => left + i * groupW + groupW / 2
  const y = (v) => top + ((max - v) / max) * (h - top - bottom)
  const barW = Math.min(14, Math.max(7, groupW * 0.22))

  const createdPath = validSource
    .map((p, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(Number(p.created) || 0)}`)
    .join(' ')
  const completedPath = validSource
    .map((p, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(Number(p.completed) || 0)}`)
    .join(' ')

  return (
    <div className="chart-box">
      <div className="chart-legend">
        <span>
          <i className="key green" />
          Created
        </span>
        <span>
          <i className="key red" />
          Completed
        </span>
      </div>
      <svg
        className="revenue-svg"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Projects created and completed over the last twelve months"
      >
        {[max, Math.ceil(max * 0.75), Math.ceil(max * 0.5), Math.ceil(max * 0.25), 0].map(
          (val, i) => (
            <g key={i}>
              <line
                x1={left}
                x2={w - right}
                y1={y(val)}
                y2={y(val)}
                className="grid-line"
              />
              <text x="4" y={y(val) + 3}>
                {val}
              </text>
            </g>
          )
        )}

        {validSource.map((p, i) => {
          const created = Number(p.created) || 0
          const completed = Number(p.completed) || 0
          return (
            <g key={p.date}>
              <line x1={x(i)} x2={x(i)} y1={top} y2={h - bottom} className="grid-line v" />
              <text x={x(i)} y={h - 8} textAnchor="middle">
                {p.label || p.date}
              </text>
              <rect
                x={x(i) - barW - 2}
                y={y(created)}
                width={barW}
                height={Math.max(0, y(0) - y(created))}
                rx="2"
                className="green-bar"
              />
              <rect
                x={x(i) + 2}
                y={y(completed)}
                width={barW}
                height={Math.max(0, y(0) - y(completed))}
                rx="2"
                className="red-bar"
              />
              <circle cx={x(i)} cy={y(created)} r="3.2" className="created-point" />
              <circle cx={x(i)} cy={y(completed)} r="3.2" className="completed-point" />
              <title>{`${p.label || p.date}: ${created} created, ${completed} completed`}</title>
            </g>
          )
        })}

        <path d={createdPath} className="created-line" fill="none" />
        <path d={completedPath} className="completed-line" fill="none" />
      </svg>
    </div>
  )
}

export function Revenue({ data, error }) {
  return (
    <Panel className="revenue">
      <PanelHead right={<span className="year">Live</span>}>
        Projects Created &amp; Completed
      </PanelHead>
      {error ? (
        <div className="chart-empty error-state">{error}</div>
      ) : !data ? (
        <LoadingState label="Loading chart..." />
      ) : data.stats.totalProjects === 0 ? (
        <div className="chart-empty">No project activity yet</div>
      ) : (
        <RevenueChartSvg points={data.chart} />
      )}
    </Panel>
  )
}
