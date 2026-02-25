import express from 'express'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const DB_FILE = path.join(__dirname, '../../data/users.json')

const getUser = (userId) => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    return data.users.find(u => u.id === userId)
  } catch {
    return null
  }
}

const saveUser = (user) => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    const index = data.users.findIndex(u => u.id === user.id)
    if (index !== -1) {
      data.users[index] = user
      fs.writeFileSync(DB_FILE, JSON.stringify(data))
    }
  } catch (e) {
    console.error(e)
  }
}

const AI_MODEL = process.env.AI_MODEL || 'Qwen/Qwen2.5-7B-Instruct'
const API_KEY = process.env.SILICONFLOW_API_KEY

const TEMPLATES = {
  'notice-generator': {
    prompt: `你是一个工会文书助手。请根据以下信息生成一份正式的通知公告：

标题：{{title}}
发布单位：{{organization}}
活动时间：{{time}}
活动地点：{{location}}
通知内容：{{content}}
参与对象：{{participants}}
报名截止：{{deadline}}
联系人：{{contact}}
联系电话：{{phone}}

请生成一份完整、规范的通知文档。`
  },
  'report-generator': {
    prompt: `你是一个工会工作报告助手。请根据以下信息生成一份工作报告：

报告标题：{{title}}
报告周期：{{period}}
工作概述：{{summary}}
重点亮点：{{highlights}}
主要成绩：{{achievements}}
存在问题：{{problems}}
下一步计划：{{nextPlan}}

请生成一份完整的工作报告。`
  },
  'speech-generator': {
    prompt: `你是一个发言稿助手。请根据以下信息生成一份发言稿：

发言标题：{{title}}
发言人：{{name}}
发言人职务：{{position}}
开场问候：{{greeting}}
主要内容：{{content}}
结束语：{{conclusion}}

请生成一份完整的发言稿。`
  },
  'activity-plan': {
    prompt: `你是一个活动策划助手。请根据以下信息生成一份活动策划方案：

策划标题：{{title}}
活动主题：{{theme}}
活动时间：{{time}}
活动地点：{{location}}
参与对象：{{participants}}
活动内容：{{content}}
奖项设置：{{awards}}
组织分工：{{responsibility}}

请生成一份完整的活动策划方案。`
  },
  'training-plan': {
    prompt: `你是一个培训方案助手。请根据以下信息生成一份培训方案：

培训标题：{{title}}
培训目标：{{goal}}
培训对象：{{target}}
培训时间：{{time}}
培训地点：{{location}}
培训内容：{{content}}
培训方式：{{method}}
考核方式：{{assessment}}

请生成一份完整的培训方案。`
  },
  'employment-plan': {
    prompt: `你是一个就业服务方案助手。请根据以下信息生成一份就业服务方案：

方案标题：{{title}}
帮扶对象：{{target}}
服务内容：{{content}}
活动时间：{{time}}
目标人数：{{targetNum}}
预算金额：{{budget}}

请生成一份完整的就业服务方案。`
  },
  'wechat-assistant': {
    prompt: `你是一个公众号运营助手。请根据以下信息生成一篇公众号推文：

文章标题：{{title}}
引言：{{intro}}
亮点：{{highlight}}
详细内容：{{details}}
结尾：{{conclusion}}
底部信息：{{footer}}

请生成一篇适合微信公众号发布的推文。`
  },
  'video-script': {
    prompt: `你是一个短视频脚本助手。请根据以下信息生成一份短视频拍摄脚本：

视频标题：{{title}}
开场画面：{{open}}
主体内容：{{main}}
结尾画面：{{ending}}
字幕内容：{{subtitle}}

请生成一份完整的短视频脚本。`
  }
}

router.post('/generate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: '请先登录', needLogin: true })
    }

    const token = authHeader.replace('Bearer ', '')
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    } catch {
      return res.status(401).json({ error: '登录已过期', needLogin: true })
    }

    const user = getUser(decoded.id)
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }

    const { toolType, formData } = req.body
    
    if (!toolType || !formData) {
      return res.status(400).json({ error: '参数不完整' })
    }

    const template = TEMPLATES[toolType]
    if (!template) {
      return res.status(400).json({ error: '不支持的工具类型' })
    }

    let prompt = template.prompt
    for (const [key, value] of Object.entries(formData)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value || '无')
    }

    const aiRes = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    const aiData = await aiRes.json()
    
    if (aiData.error) {
      return res.status(500).json({ error: aiData.error.message })
    }

    const content = aiData.choices?.[0]?.message?.content || '生成失败，请重试'

    user.usedTimes = (user.usedTimes || 0) + 1
    saveUser(user)

    res.json({
      success: true,
      data: {
        content,
        usedTimes: user.usedTimes,
        freeTimes: user.freeTimes
      }
    })
  } catch (error) {
    console.error('AI生成错误:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/check', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.json({
        success: true,
        data: {
          loggedIn: false,
          canUse: true
        }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    } catch {
      return res.json({
        success: true,
        data: {
          loggedIn: false,
          canUse: true
        }
      })
    }

    const user = getUser(decoded.id)
    if (!user) {
      return res.json({
        success: true,
        data: {
          loggedIn: false,
          canUse: true
        }
      })
    }

    const now = new Date()
    const vipValid = user.vip && user.vipExpire && new Date(user.vipExpire) > now
    const freeRemaining = (user.freeTimes || 0) - (user.usedTimes || 0)
    const canUse = vipValid || freeRemaining > 0

    res.json({
      success: true,
      data: {
        loggedIn: true,
        vip: vipValid,
        vipType: user.vipType,
        vipExpire: user.vipExpire,
        freeTimes: user.freeTimes || 0,
        usedTimes: user.usedTimes || 0,
        freeRemaining,
        canUse
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
