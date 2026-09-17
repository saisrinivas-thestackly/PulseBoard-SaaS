import express from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project.js'
import auth from '../middleware/auth.js'

const router = express.Router()
router.use(auth)
const statuses = ['todo', 'in_progress', 'completed', 'overdue']

function validateProject(body) {
  const title = String(body.title ?? '').trim()
  const description = String(body.description ?? '').trim()
  const status = String(body.status ?? 'todo')
  const dueDate = body.dueDate ? new Date(body.dueDate) : null
  const errors = {}
  if (title.length < 2 || title.length > 120) errors.title = 'Title must be 2 to 120 characters'
  if (!description) errors.description = 'Description is required'
  if (description.length > 2000) errors.description = 'Description cannot exceed 2000 characters'
  if (!statuses.includes(status)) errors.status = 'Invalid status'
  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    errors.dueDate = 'Valid due date is required'
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (dueDate < today) errors.dueDate = 'Due date cannot be in the past'
  }
  return { errors, values: { title, description, status, dueDate } }
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page ?? '1', 10) || 1)
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit ?? '10', 10) || 10))
    const q = String(req.query.q ?? '').trim()
    const filter = { owner: req.user._id }
    if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }]
    const [items, total] = await Promise.all([
      Project.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Project.countDocuments(filter)
    ])
    res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('[projects:list]', error)
    res.status(500).json({ message: 'Unable to load projects' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { errors, values } = validateProject(req.body)
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors })
    const project = await Project.create({ ...values, owner: req.user._id, completedAt: values.status === 'completed' ? new Date() : null })
    res.status(201).json({ project })
  } catch (error) {
    console.error('[projects:create]', error)
    res.status(500).json({ message: 'Unable to create project' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project id' })
    const current = await Project.findOne({ _id: req.params.id, owner: req.user._id })
    if (!current) return res.status(404).json({ message: 'Project not found' })
    const candidate = {
      title: 'title' in req.body ? req.body.title : current.title,
      description: 'description' in req.body ? req.body.description : current.description,
      status: 'status' in req.body ? req.body.status : current.status,
      dueDate: 'dueDate' in req.body ? req.body.dueDate : current.dueDate
    }
    const { errors, values } = validateProject(candidate)
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors })
    const wasCompleted = current.status === 'completed'
    current.title = values.title
    current.description = values.description
    current.status = values.status
    current.dueDate = values.dueDate
    if (values.status === 'completed' && !wasCompleted) current.completedAt = new Date()
    if (values.status !== 'completed') current.completedAt = null
    await current.save()
    res.json({ project: current })
  } catch (error) {
    console.error('[projects:update]', error)
    res.status(500).json({ message: 'Unable to update project' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project id' })
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (error) {
    console.error('[projects:delete]', error)
    res.status(500).json({ message: 'Unable to delete project' })
  }
})

export default router
