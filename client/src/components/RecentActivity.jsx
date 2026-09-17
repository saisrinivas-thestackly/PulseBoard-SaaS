import { Panel, PanelHead, LoadingState } from './BaseComponents'

export function RecentActivity({ items, loading, error }) {
  return (
    <Panel className="recent-activity-panel">
      <PanelHead>Recent Activity</PanelHead>

      {loading ? (
        <LoadingState label="Loading activity..." />
      ) : error ? (
        <div className="chart-empty error-state">{error}</div>
      ) : !items?.length ? (
        <div className="empty-state">No recent project activity.</div>
      ) : (
        <div className="activity-table-wrap">
          <table className="activity-table">
            <caption className="sr-only">Recently updated projects</caption>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Updated</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <b>{item.title}</b>
                    <small>{item.description || 'Project record'}</small>
                  </td>
                  <td>{new Date(item.updatedAt).toLocaleString()}</td>
                  <td>
                    <span className={`status ${item.status}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
