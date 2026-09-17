import { useEffect, useState } from 'react'
import { api } from '../api'
import { Modal, LoadingState } from '../components/BaseComponents'
import { SvgIcon } from '../components/SvgIcon'
import { ProjectForm } from './ProjectForm'

export function Projects({ initialQuery = '' }) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState(initialQuery)

  const load = async (p) => {
    setLoading(true)
    setError('')

    try {
      const r = await api.projects({ page: p, limit: 8, q: query })

      if (!r.items || !r.pagination) throw new Error('Invalid API response format')

      setItems(r.items)
      setPages(Math.max(1, r.pagination.pages))
      setPage(r.pagination.page)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [query])

  const save = async (form) => {
    setSaving(true)
    setError('')

    try {
      if (editing) {
        await api.updateProject(editing._id, form)
      } else {
        await api.createProject(form)
      }
      setEditing(null)
      setCreating(false)
      await load(page)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return

    setError('')

    try {
      await api.deleteProject(id)

      await load(items.length === 1 && page > 1 ? page - 1 : page)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page-panel">
      <div className="page-title">
        <div>
          <h1>Projects</h1>
          <p>Manage your projects and keep dashboard data live.</p>
        </div>
        <button className="primary action-btn" onClick={() => setCreating(true)}>
          <SvgIcon name="plus" size={17} /> New project
        </button>
      </div>

      <form
        className="project-search"
        onSubmit={(e) => {
          e.preventDefault()
          setQuery(e.currentTarget.elements.search.value)
        }}
      >
        <SvgIcon name="search" />
        <input
          name="search"
          defaultValue={query}
          placeholder="Search projects..."
          aria-label="Search projects"
        />
        <button className="secondary-btn" type="submit">
          Search
        </button>
      </form>

      {error && (
        <div className="inline-error" role="alert">
          {error}
        </div>
      )}

      {(creating || editing) && (
        <Modal
          title={editing ? 'Edit project' : 'Create project'}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
        >
          <ProjectForm
            initial={editing}
            onSave={save}
            onCancel={() => {
              setCreating(false)
              setEditing(null)
            }}
            saving={saving}
          />
        </Modal>
      )}

      <div className="projects-table">
        {loading ? (
          <LoadingState label="Loading projects..." />
        ) : items.length === 0 ? (
          <div className="empty-state large">No projects found. Create your first project.</div>
        ) : (
          <table className="project-table">
            <caption className="sr-only">Projects</caption>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Status</th>
                <th scope="col">Due date</th>
                <th scope="col">Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td data-label="Project">
                    <b>{p.title}</b>
                    <small>{p.description}</small>
                  </td>
                  <td data-label="Status">
                    <span className={`status ${p.status}`}>{p.status.replace('_', ' ')}</span>
                  </td>
                  <td data-label="Due date">{new Date(p.dueDate).toLocaleDateString()}</td>
                  <td data-label="Updated">{new Date(p.updatedAt).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <div className="row-actions">
                      <button onClick={() => setEditing(p)} aria-label={`Edit ${p.title}`}>
                        <SvgIcon name="edit" size={16} />
                      </button>
                      <button onClick={() => remove(p._id)} aria-label={`Delete ${p.title}`}>
                        <SvgIcon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button disabled={page === 1 || loading} onClick={() => load(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button disabled={page === pages || loading} onClick={() => load(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}
