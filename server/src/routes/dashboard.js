import express from 'express'
import auth from '../middleware/auth.js'
import Project from '../models/Project.js'

const router = express.Router()
router.use(auth)

router.get('/summary', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    const owner = req.user._id
    const now = new Date()
    const [counts, timeline, recentActivity] = await Promise.all([
      Project.aggregate([
        { $match: { owner } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Project.aggregate([
        { $match: { owner } },
        { $facet: {
          created: [
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } }
          ],
          completed: [
            { $match: { status: 'completed' } },
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: { $ifNull: ['$completedAt', '$updatedAt'] } } }, count: { $sum: 1 } } }
          ]
        } }
      ]),
      Project.find({ owner }).sort({ updatedAt: -1 }).limit(8).select('title description status dueDate updatedAt createdAt completedAt').lean()
    ])

    const byStatus = Object.fromEntries(counts.map(item => [item._id, item.count]))
    const total = counts.reduce((sum, item) => sum + item.count, 0)
    const completed = byStatus.completed ?? 0
    const active = (byStatus.todo ?? 0) + (byStatus.in_progress ?? 0)
    const completionRate = total ? Math.round((completed / total) * 100) : 0
    const createdMap = new Map((timeline[0]?.created ?? []).map(item => [item._id, item.count]))
    const completedMap = new Map((timeline[0]?.completed ?? []).map(item => [item._id, item.count]))
    const chart = []
    for (let offset = 11; offset >= 0; offset -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      chart.push({ date: key, label: d.toLocaleString('en-US', { month: 'short' }), created: createdMap.get(key) ?? 0, completed: completedMap.get(key) ?? 0 })
    }

    res.json({
      stats: {
        totalProjects: total,
        activeProjects: active,
        completedProjects: completed,
        overdueProjects: byStatus.overdue ?? 0,
        completionRate,
        todo: byStatus.todo ?? 0,
        in_progress: byStatus.in_progress ?? 0,
        completed: byStatus.completed ?? 0,
        overdue: byStatus.overdue ?? 0
      },
      chart,
      recentActivity
    })
  } catch (error) {
    console.error('[dashboard:summary]', error)
    res.status(500).json({ message: 'Unable to load dashboard' })
  }
})

export default router
