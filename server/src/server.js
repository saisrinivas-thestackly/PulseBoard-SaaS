import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import dashboardRoutes from './routes/dashboard.js'
import rateLimit from 'express-rate-limit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = Number(process.env.PORT || 5000)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

if (process.env.NODE_ENV === 'production' && (!process.env.MONGO_URI || !process.env.JWT_SECRET)) {
  throw new Error('MONGO_URI and JWT_SECRET are required in production')
}

if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/pulseboard'
  console.warn('MONGO_URI not set; using local development MongoDB at 127.0.0.1:27017/pulseboard')
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'pulseboard-local-development-secret-change-me'
  console.warn('JWT_SECRET not set; using a local development fallback. Set JWT_SECRET before deployment.')
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' }
})

app.disable('x-powered-by')
app.use(cors({ 
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://pulse-board-4cael7iyp-saisrinivas-thestackly.vercel.app',
      'https://pulse-board-i3df7gne8-saisrinivas-thestackly.vercel.app',
      'https://pulse-board-denyyz4pz-saisrinivas-thestackly.vercel.app',
      'https://pulse-board-198vy6qvt-saisrinivas-thestackly.vercel.app',
      clientUrl,
      'http://localhost:5173',
      'http://localhost:3000'
    ]
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, 
  credentials: true 
}))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/api/', limiter)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/projects', projectRoutes)

app.use(express.static(path.join(__dirname, '../../client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

app.use((err, _req, res, _next) => res.status(err.status || 500).json({ message: err.status ? err.message : 'Internal server error' }))

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(port, () => console.log(`PulseBoard API running on port ${port}`))
}).catch(error => {
  console.error('MongoDB connection failed', error.message)
  process.exit(1)
})

export default app