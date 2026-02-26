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
  },
  'rules-template': {
    prompt: `你是一个工会制度文档助手。请根据以下信息生成一份规章制度：

制度名称：{{title}}
制度类型：{{type}}
适用范围：{{scope}}
制定依据：{{basis}}
主要内容：{{content}}

请生成一份完整、规范的规章制度文档，包含总则、具体规定、附则等章节。`
  },
  'labor-law': {
    prompt: `你是一个劳动法律咨询助手。请根据以下信息提供法律咨询：

问题类型：{{type}}
具体问题：{{question}}
背景情况：{{background}}

请根据《劳动法》、《劳动合同法》等相关法律法规，提供专业的法律咨询回复，包括法律分析、建议措施、相关法条等内容。注意声明仅供参考，不构成法律意见。`
  },
  'assistance-plan': {
    prompt: `你是一个困难职工帮扶方案助手。请根据以下信息生成帮扶方案：

帮扶对象：{{target}}
困难类型：{{difficultyType}}
困难情况说明：{{situation}}
帮扶需求：{{needs}}

请生成一份完整的困难职工帮扶方案，包括帮扶对象基本信息、帮扶措施、帮扶安排、预期目标、保障措施等。`
  },
  'mental-health': {
    prompt: `你是一个职工心理健康助手。请根据以下信息生成心理健康相关内容：

内容类型：{{type}}
目标受众：{{audience}}
具体需求：{{needs}}

请生成适合工会开展的心理健康知识普及或活动方案。`
  },
  'fund-management': {
    prompt: `你是一个工会经费管理助手。请根据以下信息生成经费管理文档：

文档类型：{{type}}
工会名称：{{organization}}
年度/金额：{{year}}
详细内容：{{content}}

请生成一份完整的工会经费管理文档，如预算报告、报销制度或资产管理制度。`
  },
  'evaluation-plan': {
    prompt: `你是一个评优评先方案助手。请根据以下信息生成评选方案：

评选类型：{{type}}
评选名额：{{quota}}
评选条件：{{conditions}}
评选程序：{{procedure}}

请生成一份完整的评优评先方案，包括评选目的、范围、条件、程序、要求、组织领导等。`
  },
  'team-building': {
    prompt: `你是一个团建活动方案助手。请根据以下信息生成团建方案：

活动类型：{{type}}
参与人数：{{participants}}
活动主题：{{theme}}
时间安排：{{time}}
预算范围：{{budget}}

请生成一份完整的团建活动方案，包括活动目的、活动安排、团建项目建议、费用预算、组织分工、安全预案等。`
  },
  'holiday-care': {
    prompt: `你是一个节日慰问方案助手。请根据以下信息生成慰问活动方案：

节日类型：{{holiday}}
慰问对象：{{target}}
活动时间：{{time}}
预算标准：{{budget}}

请生成一份完整的节日职工慰问活动方案，包括活动主题、慰问内容、经费预算、组织分工、工作要求等。`
  },
  'model-story': {
    prompt: `你是一个劳模事迹材料助手。请根据以下信息生成事迹材料：

模范类型：{{type}}
姓名：{{name}}
单位职务：{{position}}
主要事迹：{{achievements}}
荣誉获得情况：{{honors}}

请生成一份完整的事迹材料，包括基本情况、主要事迹、获得荣誉、先进意义等章节。`
  },
  'wage-negotiation': {
    prompt: `你是一个工资集体协商助手。请根据以下信息生成协商方案：

协商类型：{{type}}
企业名称：{{company}}
协商重点：{{focus}}
职工诉求：{{demands}}

请生成一份完整的工资集体协商方案，包括协商背景、协商主体、协商代表、协商内容、协商程序、预期目标等。`
  },
  'meeting-minutes': {
    prompt: `你是一个会议纪要助手。请根据以下信息生成会议纪要：

会议名称：{{title}}
会议时间：{{time}}
会议地点：{{location}}
主持人：{{host}}
主要议题：{{topics}}
决议事项：{{decisions}}

请生成一份完整、规范的会议纪要，包括会议基本信息、议题内容、决议事项、任务分工、会议要求等。`
  },
  'news-release': {
    prompt: `你是一个新闻稿助手。请根据以下信息生成新闻稿：

新闻标题：{{title}}
新闻来源：{{source}}
活动时间：{{time}}
主要内容：{{content}}

请生成一篇完整的工会新闻稿，包括标题、电头、导语、主体、结尾等部分。`
  },
  'proposal': {
    prompt: `你是一个职工代表提案助手。请根据以下信息生成提案：

提案标题：{{title}}
提案人：{{proposer}}
附议人：{{seconder}}
提案缘由：{{reason}}
建议措施：{{suggestion}}

请生成一份完整的职工代表大会提案，包括提案人信息、提案缘由、建议措施、提案人承诺、审查意见、答复等。`
  },
  'sympathy-letter': {
    prompt: `你是一个慰问信助手。请根据以下信息生成慰问信：

慰问类型：{{type}}
慰问对象：{{target}}
慰问单位：{{sender}}
慰问内容：{{content}}

请生成一封温暖的慰问信，内容真诚、感人。`
  },
  'emergency-plan': {
    prompt: `你是一个应急预案助手。请根据以下信息生成应急预案：

预案类型：{{type}}
适用范围：{{scope}}
组织机构：{{organization}}
应急措施：{{measures}}

请生成一份完整的应急预案，包括总则、组织机构、预防预警、应急响应、后期处置、应急保障等章节。`
  },
  'collective-contract': {
    prompt: `你是一个集体合同助手。请根据以下信息生成集体合同：

企业名称：{{company}}
合同类型：{{type}}
合同期限：{{period}}
主要内容：{{content}}

请生成一份完整、规范的集体合同/专项协议，包括总则、主要内容、劳动报酬、保险福利、合同的履行变更解除终止、争议处理、附则等章节。`
  },
  'budget-report': {
    prompt: `你是一个工会经费报告助手。请根据以下信息生成预算/决算报告：

报告类型：{{type}}
工会名称：{{organization}}
年度：{{year}}
收入情况：{{income}}
支出情况：{{expense}}

请生成一份完整的工会经费预算报告或决算报告，包括基本情况、收入情况、支出情况、说明、保障措施等。`
  },
  'membership': {
    prompt: `你是一个会员管理助手。请根据以下信息生成会员管理文档：

办理类型：{{type}}
姓名：{{name}}
单位：{{department}}
个人信息：{{info}}

请生成一份完整的工会会员管理文档，如入会申请书、会员登记表、会员证或退会申请。`
  },
  'labor-protection': {
    prompt: `你是一个劳保用品管理助手。请根据以下信息生成管理文档：

文档类型：{{type}}
单位名称：{{organization}}
岗位类型：{{positions}}
详细内容：{{content}}

请生成一份完整的劳保用品管理文档，如发放管理制度、发放标准、领用登记表或库存台账。`
  }
}

router.post('/generate', async (req, res) => {
  try {
    // 临时：去掉登录限制
    // const authHeader = req.headers.authorization
    // if (!authHeader) {
    //   return res.status(401).json({ error: '请先登录', needLogin: true })
    // }

    // const token = authHeader.replace('Bearer ', '')
    // let decoded
    // try {
    //   decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    // } catch {
    //   return res.status(401).json({ error: '登录已过期', needLogin: true })
    // }

    // const user = getUser(decoded.id)
    // if (!user) {
    //   return res.status(404).json({ error: '用户不存在' })
    // }

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

    res.json({
      success: true,
      data: {
        content
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
