import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import imageRoutes from './routes/image.js'
import pdfRoutes from './routes/pdf.js'
import textRoutes from './routes/text.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
  }
}))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' })
})

app.use('/api/image', imageRoutes)
app.use('/api/pdf', pdfRoutes)
app.use('/api/text', textRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`)
})
