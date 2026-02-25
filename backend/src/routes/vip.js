import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const DB_FILE = path.join(__dirname, '../../data/users.json')

const getUsers = () => {
  try {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }))
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')).users
  } catch {
    return []
  }
}

const saveUsers = (users) => {
  const dir = path.dirname(DB_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(DB_FILE, JSON.stringify({ users }))
}

router.post('/register', (req, res) => {
  try {
    const { phone, password, code } = req.body
    
    if (!phone || !password) {
      return res.status(400).json({ error: '请填写手机号和密码' })
    }

    if (code !== '666666' && code !== '1234') {
      return res.status(400).json({ error: '验证码错误' })
    }

    const users = getUsers()
    if (users.find(u => u.phone === phone)) {
      return res.status(400).json({ error: '该手机号已注册' })
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')

    const newUser = {
      id: Date.now().toString(),
      phone,
      password: `${salt}:${hashedPassword}`,
      vip: false,
      vipExpire: null,
      vipType: null,
      freeTimes: 3,
      usedTimes: 0,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    saveUsers(users)

    const token = jwt.sign(
      { id: newUser.id, phone: newUser.phone },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          phone: newUser.phone,
          vip: newUser.vip,
          vipExpire: newUser.vipExpire,
          freeTimes: newUser.freeTimes,
          usedTimes: newUser.usedTimes
        }
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/login', (req, res) => {
  try {
    const { phone, password } = req.body
    
    if (!phone || !password) {
      return res.status(400).json({ error: '请填写手机号和密码' })
    }

    const users = getUsers()
    const user = users.find(u => u.phone === phone)
    
    if (!user) {
      return res.status(400).json({ error: '用户不存在' })
    }

    const [salt, key] = user.password.split(':')
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    
    if (hashedPassword !== key) {
      return res.status(400).json({ error: '密码错误' })
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          vip: user.vip,
          vipExpire: user.vipExpire,
          vipType: user.vipType,
          freeTimes: user.freeTimes,
          usedTimes: user.usedTimes
        }
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/verify-code', (req, res) => {
  const { phone } = req.body
  if (!phone) {
    return res.status(400).json({ error: '请输入手机号' })
  }
  res.json({ success: true, code: '666666' })
})

router.post('/vip/buy', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: '请先登录' })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    
    const { type } = req.body
    if (!['month', 'quarter', 'year'].includes(type)) {
      return res.status(400).json({ error: '无效的会员类型' })
    }

    const prices = { month: 99, quarter: 199, year: 999 }
    const days = { month: 30, quarter: 90, year: 365 }

    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === decoded.id)
    
    if (userIndex === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }

    const user = users[userIndex]
    const now = new Date()
    let expireDate = user.vipExpire ? new Date(user.vipExpire) : now
    
    if (expireDate < now) {
      expireDate = now
    }
    expireDate.setDate(expireDate.getDate() + days[type])

    users[userIndex] = {
      ...user,
      vip: true,
      vipExpire: expireDate.toISOString(),
      vipType: type
    }
    saveUsers(users)

    res.json({
      success: true,
      data: {
        vip: true,
        vipExpire: expireDate.toISOString(),
        vipType: type,
        price: prices[type]
      }
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: '登录已过期' })
    }
    res.status(500).json({ error: error.message })
  }
})

router.get('/info', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: '请先登录' })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')

    const users = getUsers()
    const user = users.find(u => u.id === decoded.id)
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        phone: user.phone,
        vip: user.vip,
        vipExpire: user.vipExpire,
        vipType: user.vipType,
        freeTimes: user.freeTimes,
        usedTimes: user.usedTimes
      }
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: '登录已过期' })
    }
    res.status(500).json({ error: error.message })
  }
})

export default router
