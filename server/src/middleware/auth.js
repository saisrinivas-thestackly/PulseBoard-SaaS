import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export default async function auth(req, res, next) {
  try {
    const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null)
    if (!token) return res.status(401).json({ message: 'Authentication required' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('_id name email')
    if (!user) return res.status(401).json({ message: 'Authentication required' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
