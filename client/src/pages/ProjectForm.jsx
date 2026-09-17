import { useState } from 'react'

const formatDateForInput = (date) => {
  if (!date) return ''
  const str = typeof date === 'string' ? date : date instanceof Date ? date.toISOString() : ''
  return str.slice(0, 10)
}

function validateClient(form) {
  const errors = {}
  const title = form.title.trim()
  const description = form.description.trim()

  if (title.length < 2) errors.title = 'Title must be at least 2 characters'
  if (title.length > 120) errors.title = 'Title cannot exceed 120 characters'
  if (!description) errors.description = 'Description is required'
  if (description.length > 2000) errors.description = 'Description cannot exceed 2000 characters'

  if (!form.dueDate) {
    errors.dueDate = 'Due date is required'
  } else {
    const selected = new Date(form.dueDate + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (Number.isNaN(selected.getTime())) errors.dueDate = 'Enter a valid due date'
    else if (selected < today) errors.dueDate = 'Due date cannot be in the past'
  }

  return errors
}

export function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, dueDate: formatDateForInput(initial.dueDate) }
      : { title: '', description: '', status: 'todo', dueDate: '' }
  )
  const [errors, setErrors] = useState({})

  const submit = async (e) => {
    e.preventDefault()

    const next = validateClient(form)
    if (Object.keys(next).length) return setErrors(next)

    setErrors({})

    await onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate,
    })
  }

  const field = (key, value) => setForm((v) => ({ ...v, [key]: value }))

  return (
    <form className="project-form" onSubmit={submit} noValidate>
      <label>
        Title
        <input
          autoFocus
          name="title"
          maxLength={120}
          value={form.title}
          onChange={(e) => field('title', e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && <small id="title-error">{errors.title}</small>}
      </label>

      <label>
        Description
        <textarea
          name="description"
          maxLength={2000}
          value={form.description}
          onChange={(e) => field('description', e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && <small id="description-error">{errors.description}</small>}
      </label>

      <div className="form-row">
        <label>
          Status
          <select name="status" value={form.status} onChange={(e) => field('status', e.target.value)}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>
        <label>
          Due date
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={(e) => field('dueDate', e.target.value)}
            aria-invalid={!!errors.dueDate}
            aria-describedby={errors.dueDate ? 'due-error' : undefined}
          />
          {errors.dueDate && <small id="due-error">{errors.dueDate}</small>}
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary" disabled={saving}>
          {saving ? 'Saving...' : initial ? 'Update project' : 'Create project'}
        </button>
      </div>
    </form>
  )
}
