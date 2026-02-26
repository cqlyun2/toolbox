export const categories = [
  { id: 'image', name: '图片工具', icon: '🖼️', color: 'bg-pink-500' },
  { id: 'pdf', name: 'PDF工具', icon: '📄', color: 'bg-red-500' },
  { id: 'text', name: '文本工具', icon: '📝', color: 'bg-blue-500' },
  { id: 'dev', name: '开发工具', icon: '💻', color: 'bg-green-500' },
  { id: 'data', name: '数据换算', icon: '🔢', color: 'bg-yellow-500' },
  { id: 'life', name: '生活工具', icon: '🏠', color: 'bg-purple-500' },
  { id: 'ai', name: 'AI工具', icon: '🤖', color: 'bg-indigo-500' },
  { id: 'yugong', name: '渝工小工具', icon: '🏛️', color: 'bg-orange-500' }
]

export const tools = [
  {
    id: 'image-compress',
    name: '图片压缩',
    description: '智能压缩图片，保持画质的同时减小体积',
    category: 'image',
    icon: '🗜️',
    hot: true
  },
  {
    id: 'image-resize',
    name: '图片调整尺寸',
    description: '在线调整图片大小和尺寸',
    category: 'image',
    icon: '📐'
  },
  {
    id: 'image-format',
    name: '图片格式转换',
    description: '支持PNG、JPG、WebP等格式互转',
    category: 'image',
    icon: '🔄'
  },
  {
    id: 'image-crop',
    name: '图片裁剪',
    description: '自由裁剪图片，支持多种比例',
    category: 'image',
    icon: '✂️'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF转Word',
    description: '将PDF文件转换为可编辑的Word文档',
    category: 'pdf',
    icon: '📄',
    hot: true
  },
  {
    id: 'word-to-pdf',
    name: 'Word转PDF',
    description: '将Word文档转换为PDF格式',
    category: 'pdf',
    icon: '📋'
  },
  {
    id: 'pdf-merge',
    name: 'PDF合并',
    description: '多个PDF文件合并为一个',
    category: 'pdf',
    icon: '📚'
  },
  {
    id: 'pdf-split',
    name: 'PDF拆分',
    description: '将PDF文件拆分为多个文件',
    category: 'pdf',
    icon: '✂️'
  },
  {
    id: 'text-count',
    name: '字数统计',
    description: '统计文本字数、字符数、行数',
    category: 'text',
    icon: '📊',
    hot: true
  },
  {
    id: 'text-format',
    name: 'JSON格式化',
    description: 'JSON数据格式化和校验',
    category: 'text',
    icon: '📝'
  },
  {
    id: 'base64',
    name: 'Base64编解码',
    description: 'Base64编码和解码工具',
    category: 'dev',
    icon: '🔐'
  },
  {
    id: 'url-encode',
    name: 'URL编解码',
    description: 'URL编码和解码工具',
    category: 'dev',
    icon: '🔗'
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: '时间戳和日期时间互转',
    category: 'dev',
    icon: '⏰',
    hot: true
  },
  {
    id: 'uuid',
    name: 'UUID生成器',
    description: '生成唯一标识符UUID',
    category: 'dev',
    icon: '🔑'
  },
  {
    id: 'unit-convert',
    name: '单位换算',
    description: '长度、重量、温度等单位换算',
    category: 'data',
    icon: '📏'
  },
  {
    id: 'number-base',
    name: '进制转换',
    description: '二进制、八进制、十进制、十六进制互转',
    category: 'data',
    icon: '🔢'
  },
  {
    id: 'qrcode',
    name: '二维码生成',
    description: '生成自定义二维码',
    category: 'life',
    icon: '📱',
    hot: true
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '颜色选取和格式转换',
    category: 'life',
    icon: '🎨'
  },
  {
    id: 'weather',
    name: '天气查询',
    description: '查询城市实时天气信息',
    category: 'life',
    icon: '🌤️',
    hot: true
  },
  {
    id: 'what-to-eat',
    name: '今天吃什么',
    description: '随机推荐美食，解决选择困难',
    category: 'life',
    icon: '🍜',
    hot: true
  },
  {
    id: 'password',
    name: '密码生成器',
    description: '生成安全随机密码',
    category: 'life',
    icon: '🔐'
  },
  {
    id: 'lottery',
    name: '随机抽奖',
    description: '输入名单进行随机抽奖',
    category: 'life',
    icon: '🎰'
  },
  {
    id: 'prompt-library',
    name: 'Prompt模板库',
    description: '收集常用AI提示词，一键复制',
    category: 'ai',
    icon: '📚',
    hot: true
  },
  {
    id: 'token-counter',
    name: 'Token估算器',
    description: '估算文本的Token数量',
    category: 'ai',
    icon: '🔢'
  },
  {
    id: 'ai-prompt-gen',
    name: 'AI绘画提示词',
    description: '生成Midjourney/Stable Diffusion提示词',
    category: 'ai',
    icon: '🎨',
    hot: true
  },
  {
    id: 'prompt-optimizer',
    name: 'Prompt优化器',
    description: '优化和格式化提示词结构',
    category: 'ai',
    icon: '✨'
  },
  {
    id: 'lorem-gen',
    name: '文本占位符',
    description: '生成占位文本，支持中英文',
    category: 'text',
    icon: '📄'
  },
  {
    id: 'regex-tester',
    name: '正则测试器',
    description: '在线测试正则表达式',
    category: 'dev',
    icon: '🔍',
    hot: true
  },
  {
    id: 'hash-gen',
    name: '哈希生成器',
    description: '计算MD5、SHA等哈希值',
    category: 'dev',
    icon: '#️⃣'
  },
  {
    id: 'notice-generator',
    name: '通知公告生成器',
    description: '快速生成工会通知、公告、函件',
    category: 'yugong',
    icon: '📢',
    hot: true
  },
  {
    id: 'report-generator',
    name: '工作报告生成器',
    description: '年度/季度工作总结、汇报材料',
    category: 'yugong',
    icon: '📊'
  },
  {
    id: 'speech-generator',
    name: '发言稿生成器',
    description: '职代会发言、领导讲话、先进表彰',
    category: 'yugong',
    icon: '🎤'
  },
  {
    id: 'activity-plan',
    name: '活动策划生成器',
    description: '文体活动、劳动竞赛、节日活动',
    category: 'yugong',
    icon: '🎪'
  },
  {
    id: 'training-plan',
    name: '培训方案生成器',
    description: '职工培训、技能提升方案',
    category: 'yugong',
    icon: '📚'
  },
  {
    id: 'employment-plan',
    name: '就业服务方案',
    description: '招聘会、岗位推荐、帮扶就业',
    category: 'yugong',
    icon: '💼'
  },
  {
    id: 'wechat-assistant',
    name: '公众号助手',
    description: '生成微信公众号推文',
    category: 'yugong',
    icon: '📱'
  },
  {
    id: 'video-script',
    name: '短视频脚本',
    description: '工会宣传视频、活动花絮脚本',
    category: 'yugong',
    icon: '🎬'
  },
  {
    id: 'team-shuffle',
    name: '随机分组',
    description: '将人员随机分成若干组',
    category: 'yugong',
    icon: '👥'
  },
  {
    id: 'roll-call',
    name: '随机点名',
    description: '现场随机抽取人员',
    category: 'yugong',
    icon: '🎯'
  },
  {
    id: 'rules-template',
    name: '规章制度模板',
    description: '工会规章制度、工作管理办法',
    category: 'yugong',
    icon: '📋'
  },
  {
    id: 'labor-law',
    name: '劳动法律咨询',
    description: '劳动法、工会法相关问题解答',
    category: 'yugong',
    icon: '⚖️'
  },
  {
    id: 'assistance-plan',
    name: '困难职工帮扶方案',
    description: '困难职工帮扶、慰问方案',
    category: 'yugong',
    icon: '🤝'
  },
  {
    id: 'mental-health',
    name: '职工心理健康',
    description: '心理健康知识、疏导方案',
    category: 'yugong',
    icon: '🧠'
  },
  {
    id: 'fund-management',
    name: '工会经费管理',
    description: '经费预算、报销制度、资产管理',
    category: 'yugong',
    icon: '💰'
  },
  {
    id: 'evaluation-plan',
    name: '评优评先方案',
    description: '优秀员工、先进班组评选',
    category: 'yugong',
    icon: '🏆'
  },
  {
    id: 'team-building',
    name: '团建活动方案',
    description: '团队建设、户外拓展活动',
    category: 'yugong',
    icon: '🎳'
  },
  {
    id: 'holiday-care',
    name: '节日慰问方案',
    description: '节假日职工慰问活动方案',
    category: 'yugong',
    icon: '🎁'
  },
  {
    id: 'model-story',
    name: '劳模事迹材料',
    description: '劳动模范、先进典型事迹材料',
    category: 'yugong',
    icon: '🌟'
  },
  {
    id: 'wage-negotiation',
    name: '工资集体协商',
    description: '工资协商方案、谈判要点',
    category: 'yugong',
    icon: '🤝'
  },
  {
    id: 'meeting-minutes',
    name: '会议纪要',
    description: '工会会议、职代会会议纪要',
    category: 'yugong',
    icon: '📝'
  },
  {
    id: 'news-release',
    name: '新闻稿',
    description: '工会活动新闻稿、通讯稿',
    category: 'yugong',
    icon: '📰'
  },
  {
    id: 'proposal',
    name: '职工代表提案',
    description: '职工代表大会提案',
    category: 'yugong',
    icon: '📋'
  },
  {
    id: 'sympathy-letter',
    name: '慰问信',
    description: '节日慰问信、困难职工慰问信',
    category: 'yugong',
    icon: '💌'
  },
  {
    id: 'emergency-plan',
    name: '应急预案',
    description: '突发事件应急预案、安全生产预案',
    category: 'yugong',
    icon: '🚨'
  },
  {
    id: 'collective-contract',
    name: '集体合同',
    description: '集体合同、劳动协议',
    category: 'yugong',
    icon: '📜'
  },
  {
    id: 'budget-report',
    name: '预算决算报告',
    description: '工会经费预算、决算报告',
    category: 'yugong',
    icon: '📊'
  },
  {
    id: 'membership',
    name: '会员管理',
    description: '会员发展、会籍管理',
    category: 'yugong',
    icon: '👥'
  },
  {
    id: 'labor-protection',
    name: '劳保用品管理',
    description: '劳保用品发放、库存管理',
    category: 'yugong',
    icon: '🦺'
  }
]

export const getToolsByCategory = (categoryId) => {
  return tools.filter(tool => tool.category === categoryId)
}

export const getToolById = (toolId) => {
  return tools.find(tool => tool.id === toolId)
}

export const searchTools = (query) => {
  const q = query.toLowerCase()
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(q) || 
    tool.description.toLowerCase().includes(q)
  )
}
