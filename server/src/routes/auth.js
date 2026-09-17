import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import { setAuthCookie, signToken } from '../utils/auth.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' }
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again in 15 minutes.' }
})

router.post('/register', async (req, res) => {
  try {
    const name = String(req.body.name ?? '').trim()
    const email = String(req.body.email ?? '').trim().toLowerCase()
    const password = String(req.body.password ?? '')
    const errors = {}
    if (name.length < 2 || name.length > 80) errors.name = 'Name must be 2 to 80 characters'
    if (!emailPattern.test(email) || email.length > 160) errors.email = 'Enter a valid email'
    if (password.length < 8 || password.length > 128) errors.password = 'Password must be 8 to 128 characters'
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors })
    if (await User.exists({ email })) return res.status(409).json({ message: 'Email is already registered' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash })
    setAuthCookie(res, signToken(user._id.toString()))
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    console.error('[auth:register]', error)
    if (error?.code === 11000) return res.status(409).json({ message: 'Email is already registered' })
    res.status(500).json({ message: 'Unable to register' })
  }
})

router.post('/login', authLimiter, async (req, res) => {
  try {
    const email = String(req.body.email ?? '').trim().toLowerCase()
    const password = String(req.body.password ?? '')
    if (!emailPattern.test(email) || !password) return res.status(400).json({ message: 'Email and password are required' })
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' })
    setAuthCookie(res, signToken(user._id.toString()))
    res.json({ user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    console.error('[auth:login]', error)
    res.status(500).json({ message: 'Unable to login' })
  }
})

router.post('/logout', (_req, res) => {
  res.clearCookie('token', cookieOptions)
  res.json({ message: 'Logged out' })
})

router.get('/me', auth, (req, res) => res.json({ user: req.user }))

export default router
