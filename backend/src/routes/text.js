import express from 'express'

const router = express.Router()

router.post('/count', (req, res) => {
  const { text } = req.body
  
  if (!text) {
    return res.status(400).json({ error: '请提供文本' })
  }

  const stats = {
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
    chinese: (text.match(/[\u4e00-\u9fa5]/g) || []).length,
    english: (text.match(/[a-zA-Z]/g) || []).length,
    numbers: (text.match(/\d/g) || []).length
  }

  res.json({ success: true, stats })
})

router.post('/format-json', (req, res) => {
  const { json, indent = 2 } = req.body
  
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json
    const formatted = JSON.stringify(parsed, null, indent)
    res.json({ success: true, formatted })
  } catch (error) {
    res.status(400).json({ error: '无效的JSON格式' })
  }
})

router.post('/base64', (req, res) => {
  const { text, action = 'encode' } = req.body
  
  try {
    let result
    if (action === 'encode') {
      result = Buffer.from(text).toString('base64')
    } else {
      result = Buffer.from(text, 'base64').toString('utf-8')
    }
    res.json({ success: true, result })
  } catch (error) {
    res.status(400).json({ error: '编解码失败' })
  }
})

export default router
