import express from 'express'
import bcrypt from 'bcrypt'
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
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const USERS_FILE = path.join(__dirname, '../../../data/users.json')

const ensureUsersFile = async () => {
  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true })
    await fs.writeFile(USERS_FILE, '[]')
  }
}

const getUsers = async () => {
  await ensureUsersFile()
  const data = await fs.readFile(USERS_FILE, 'utf-8')
  return JSON.parse(data)
}

const saveUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

const validatePassword = (password) => {
  if (password.length < 8) {
    return '密码长度至少8个字符'
  }
  if (!/[A-Z]/.test(password)) {
    return '密码必须包含至少一个大写字母'
  }
  if (!/[a-z]/.test(password)) {
    return '密码必须包含至少一个小写字母'
  }
  if (!/[0-9]/.test(password)) {
    return '密码必须包含至少一个数字'
  }
  return null
}

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }
    
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({ error: '用户名长度需在2-20个字符之间' })
    }
    
    const passwordError = validatePassword(password)
    if (passwordError) {
      return res.status(400).json({ error: passwordError })
    }
    
    const users = await getUsers()
    
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: '用户名已存在' })
    }
    
    if (email && users.find(u => u.email === email)) {
      return res.status(400).json({ error: '邮箱已被注册' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      email: email || '',
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    await saveUsers(users)
    
    const token = jwt.sign({ id: newUser.id, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    
    res.json({
      success: true,
      token,
      user: { id: newUser.id, username, email: newUser.email }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: '请输入用户名和密码' })
    }
    
    const users = await getUsers()
    const user = users.find(u => u.username === username)
    
    if (!user) {
      return res.status(400).json({ error: '用户名或密码错误' })
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return res.status(400).json({ error: '用户名或密码错误' })
    }
    
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    
    res.json({
      success: true,
      token,
      user: { id: user.id, username, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: '未登录' })
    }
    
    const decoded = jwt.verify(token, JWT_SECRET)
    const users = await getUsers()
    const user = users.find(u => u.id === decoded.id)
    
    if (!user) {
      return res.status(401).json({ error: '用户不存在' })
    }
    
    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email }
    })
  } catch (error) {
    res.status(401).json({ error: '登录已过期' })
  }
})

export default router
