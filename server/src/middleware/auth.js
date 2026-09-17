import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    let token = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required'
      })
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user = await User.findById(payload.userId)
      .select('_id name email')

    if (!user) {
      return res.status(401).json({
        message: 'Authentication required'
      })
    }

    req.user = user

    next()
  } catch (error) {
    console.error('[auth]', error.message)

    return res.status(401).json({
      message: 'Invalid or expired token'
    })
  }
}