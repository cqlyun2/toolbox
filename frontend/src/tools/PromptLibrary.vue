<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-4">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="搜索提示词..."
        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <select v-model="selectedCategory" class="px-4 py-2 border border-gray-200 rounded-lg">
        <option value="all">全部分类</option>
        <option v-for="cat in promptCategories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    
    <div class="grid md:grid-cols-2 gap-4">
      <div 
        v-for="prompt in filteredPrompts" 
        :key="prompt.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-medium text-gray-800">{{ prompt.title }}</h3>
            <span class="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded">{{ prompt.category }}</span>
          </div>
          <button 
            @click="copyPrompt(prompt.content)"
            class="text-blue-500 hover:text-blue-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-500 mb-3">{{ prompt.description }}</p>
        <div class="bg-gray-50 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
          {{ prompt.content }}
        </div>
        <div class="flex items-center justify-between mt-3">
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tag in prompt.tags" 
              :key="tag"
              class="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded"
            >
              #{{ tag }}
            </span>
          </div>
          <button 
            @click="usePrompt(prompt)"
            class="text-sm text-blue-500 hover:underline"
          >
            使用
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">{{ selectedPrompt?.title }}</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <textarea 
          v-model="editableContent"
          class="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div class="flex justify-end space-x-3 mt-4">
          <button @click="copyPrompt(editableContent)" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            复制
          </button>
          <button @click="showModal = false" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const showModal = ref(false)
const selectedPrompt = ref(null)
const editableContent = ref('')

const promptCategories = ['写作', '编程', '翻译', '营销', '学习', '创意']

const prompts = [
  {
    id: 1,
    title: '文章写作助手',
    category: '写作',
    description: '帮助你撰写高质量文章',
    content: `请帮我写一篇关于[主题]的文章，要求：
1. 字数约[字数]字
2. 风格：[正式/轻松/专业/幽默]
3. 目标读者：[读者群体]
4. 包含以下要点：[要点列表]`,
    tags: ['文章', '写作', '内容创作']
  },
  {
    id: 2,
    title: '代码解释器',
    category: '编程',
    description: '解释代码功能和逻辑',
    content: `请解释以下代码的功能和逻辑：

\`\`\`[语言]
[代码]
\`\`\`

要求：
1. 逐行解释代码
2. 说明整体功能
3. 指出可能的优化点`,
    tags: ['代码', '解释', '学习']
  },
  {
    id: 3,
    title: '代码优化',
    category: '编程',
    description: '优化和重构代码',
    content: `请优化以下代码：

\`\`\`[语言]
[代码]
\`\`\`

优化方向：
1. 性能优化
2. 代码可读性
3. 最佳实践
4. 添加注释`,
    tags: ['代码', '优化', '重构']
  },
  {
    id: 4,
    title: '翻译助手',
    category: '翻译',
    description: '专业翻译文本',
    content: `请将以下内容翻译成[目标语言]：

[原文]

翻译要求：
1. 保持原文语气和风格
2. 使用地道的表达方式
3. 专业术语保持准确`,
    tags: ['翻译', '语言', '多语言']
  },
  {
    id: 5,
    title: '营销文案',
    category: '营销',
    description: '生成吸引人的营销文案',
    content: `请为[产品/服务]撰写营销文案：

产品信息：
- 名称：[产品名]
- 特点：[主要特点]
- 目标用户：[目标群体]
- 核心卖点：[卖点]

要求：
1. 标题吸引眼球
2. 正文突出卖点
3. 结尾有行动号召
4. 字数约[字数]字`,
    tags: ['营销', '文案', '推广']
  },
  {
    id: 6,
    title: '学习计划生成',
    category: '学习',
    description: '制定个性化学习计划',
    content: `请帮我制定学习[技能/主题]的计划：

背景信息：
- 当前水平：[初学者/中级/高级]
- 可用时间：[每天X小时]
- 学习目标：[具体目标]
- 学习周期：[X周/月]

请提供：
1. 分阶段学习目标
2. 推荐学习资源
3. 每周学习安排
4. 检验学习效果的方法`,
    tags: ['学习', '计划', '自我提升']
  },
  {
    id: 7,
    title: '标题生成器',
    category: '写作',
    description: '生成吸引人的标题',
    content: `请为以下内容生成10个吸引人的标题：

内容摘要：[摘要]
目标读者：[读者群体]
风格要求：[专业/轻松/有趣/严肃]

要求：
1. 标题要有吸引力
2. 包含关键词
3. 长度适中（15-30字）`,
    tags: ['标题', '写作', '内容']
  },
  {
    id: 8,
    title: 'SWOT分析',
    category: '营销',
    description: '进行SWOT分析',
    content: `请对[产品/公司/项目]进行SWOT分析：

背景信息：
- 名称：[名称]
- 行业：[行业]
- 主要竞争对手：[竞争对手]

请分析：
1. Strengths（优势）
2. Weaknesses（劣势）
3. Opportunities（机会）
4. Threats（威胁）

并给出战略建议。`,
    tags: ['分析', '战略', '商业']
  },
  {
    id: 9,
    title: '角色扮演',
    category: '创意',
    description: '让AI扮演特定角色',
    content: `请你扮演一个[角色描述]，具有以下特点：

角色设定：
- 身份：[身份]
- 性格：[性格特点]
- 专业领域：[领域]
- 说话风格：[风格]

我将以[你的角色]与你对话，请始终保持角色设定，用第一人称回应。

我的第一个问题是：[问题]`,
    tags: ['角色', '创意', '对话']
  },
  {
    id: 10,
    title: 'Bug修复助手',
    category: '编程',
    description: '帮助定位和修复代码问题',
    content: `请帮我分析并修复以下Bug：

代码：
\`\`\`[语言]
[代码]
\`\`\`

错误信息：
[错误信息]

期望行为：
[期望的结果]

请：
1. 分析错误原因
2. 提供修复方案
3. 解释为什么会出现这个错误`,
    tags: ['Bug', '调试', '修复']
  },
  {
    id: 11,
    title: '邮件撰写',
    category: '写作',
    description: '撰写专业邮件',
    content: `请帮我写一封邮件：

邮件类型：[商务/求职/感谢/道歉/其他]
收件人：[收件人身份]
主题：[邮件主题]
主要内容：[要表达的内容]
语气：[正式/友好/严肃]

要求：
1. 结构清晰
2. 语言得体
3. 简洁明了`,
    tags: ['邮件', '商务', '沟通']
  },
  {
    id: 12,
    title: 'API文档生成',
    category: '编程',
    description: '生成API接口文档',
    content: `请为以下API生成文档：

接口信息：
- 请求方法：[GET/POST/PUT/DELETE]
- 接口路径：[路径]
- 功能描述：[描述]
- 请求参数：[参数列表]
- 响应格式：[格式]

请生成包含以下内容的API文档：
1. 接口说明
2. 请求参数表格
3. 响应示例
4. 错误码说明`,
    tags: ['API', '文档', '开发']
  }
]

const filteredPrompts = computed(() => {
  let result = prompts
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  return result
})

const copyPrompt = async (content) => {
  await navigator.clipboard.writeText(content)
  alert('已复制到剪贴板')
}

const usePrompt = (prompt) => {
  selectedPrompt.value = prompt
  editableContent.value = prompt.content
  showModal.value = true
}
</script>
