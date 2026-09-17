import { SvgIcon } from './SvgIcon'

export function StatCard({ s, loading, error }) {
  return (
    <article className="stat-card" aria-label={s.title}>
      <div className="stat-content">
        <div className="stat-name">
          <img
            className="kpi-up-arrow"
            src="/assets/kpi-up-arrow.png"
            alt=""
            aria-hidden="true"
          />
          <span>{s.title}</span>
        </div>

        <div className="stat-value-row">
          {loading ? (
            <span className="stat-loading">
              <span className="spinner" />
            </span>
          ) : (
            <strong>{error ? '—' : s.value}</strong>
          )}
          <span className={`badge ${error ? 'down' : s.tone}`}>
            {error ? 'Error' : s.badge}
          </span>
        </div>
      </div>

      <div className="stat-tip">
        <i />
        <span>{error ? error : s.note}</span>
        <button type="button" aria-label={`More about ${s.title}`}>
          <SvgIcon name="chevron" size={15} />
        </button>
      </div>
    </article>
  )
}
