import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

const SKILLS_FILE = path.join(__dirname, '../../../workflows/skills.json')

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(SKILLS_FILE)) {
      return res.json([])
    }
    const data = fs.readFileSync(SKILLS_FILE, 'utf-8')
    const skills = JSON.parse(data)
    res.json(skills)
  } catch (e) {
    console.error('读取技能失败:', e)
    res.json([])
  }
})

export default router
