import express from 'express'
import jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const DATA_DIR = path.join(__dirname, '../../../data')

const ensureDataFile = async (filename, defaultData = []) => {
  const filePath = path.join(DATA_DIR, filename)
  try {
    await fs.access(filePath)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(defaultData))
  }
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

const saveDataFile = async (filename, data) => {
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

const authenticate = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

router.get('/favorites', async (req, res) => {
  try {
    const user = await authenticate(req)
    if (!user) {
      return res.status(401).json({ error: '请先登录' })
    }
    const data = await ensureDataFile('favorites.json', [])
    const userFavorites = data.find(u => u.userId === user.id)
    res.json({ success: true, favorites: userFavorites?.tools || [] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/favorites', async (req, res) => {
  try {
    const user = await authenticate(req)
    if (!user) {
      return res.status(401).json({ error: '请先登录' })
    }
    const { toolId, action } = req.body
    const data = await ensureDataFile('favorites.json', [])
    let userFavorites = data.find(u => u.userId === user.id)
    if (!userFavorites) {
      userFavorites = { userId: user.id, tools: [] }
      data.push(userFavorites)
    }
    if (action === 'add' && !userFavorites.tools.includes(toolId)) {
      userFavorites.tools.push(toolId)
    } else if (action === 'remove') {
      userFavorites.tools = userFavorites.tools.filter(t => t !== toolId)
    }
    await saveDataFile('favorites.json', data)
    res.json({ success: true, favorites: userFavorites.tools })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/history', async (req, res) => {
  try {
    const user = await authenticate(req)
    if (!user) {
      return res.status(401).json({ error: '请先登录' })
    }
    const data = await ensureDataFile('history.json', [])
    const userHistory = data.find(u => u.userId === user.id)
    res.json({ success: true, history: userHistory?.tools || [] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/history', async (req, res) => {
  try {
    const user = await authenticate(req)
    if (!user) {
      return res.status(401).json({ error: '请先登录' })
    }
    const { toolId } = req.body
    const data = await ensureDataFile('history.json', [])
    let userHistory = data.find(u => u.userId === user.id)
    if (!userHistory) {
      userHistory = { userId: user.id, tools: [] }
      data.push(userHistory)
    }
    userHistory.tools = userHistory.tools.filter(t => t !== toolId)
    userHistory.tools.unshift(toolId)
    userHistory.tools = userHistory.tools.slice(0, 20)
    await saveDataFile('history.json', data)
    res.json({ success: true, history: userHistory.tools })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
