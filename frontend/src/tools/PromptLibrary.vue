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
            <span :class="['text-xs px-2 py-0.5 rounded', getCategoryColor(prompt.category)]">{{ prompt.category }}</span>
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
import { ref, computed, inject } from 'vue'

const toast = inject('toast')
const searchQuery = ref('')
const selectedCategory = ref('all')
const showModal = ref(false)
const selectedPrompt = ref(null)
const editableContent = ref('')

const promptCategories = ['写作', '编程', '翻译', '营销', '学习', '创意', '生图', '生视频']

const getCategoryColor = (category) => {
  const colors = {
    '写作': 'bg-blue-100 text-blue-600',
    '编程': 'bg-green-100 text-green-600',
    '翻译': 'bg-purple-100 text-purple-600',
    '营销': 'bg-orange-100 text-orange-600',
    '学习': 'bg-yellow-100 text-yellow-600',
    '创意': 'bg-pink-100 text-pink-600',
    '生图': 'bg-indigo-100 text-indigo-600',
    '生视频': 'bg-red-100 text-red-600'
  }
  return colors[category] || 'bg-gray-100 text-gray-600'
}

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
    id: 8,
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
    id: 9,
    title: 'Midjourney通用提示词',
    category: '生图',
    description: 'Midjourney高质量出图模板',
    content: `[主体描述], [风格], [氛围], [光影], [构图], [画质关键词]

示例：
A beautiful young woman with long flowing hair, standing in a cherry blossom garden, anime style, soft pink atmosphere, golden hour lighting, portrait composition, 8K, highly detailed --ar 2:3 --v 6`,
    tags: ['MJ', '绘画', 'AI绘图']
  },
  {
    id: 10,
    title: '人物肖像生图',
    category: '生图',
    description: '生成高质量人物肖像',
    content: `[人物描述], [表情], [服装], [发型], [姿势], [背景], [风格]portrait, [画质]photorealistic, [光影]lighting

示例：
Portrait of a confident businesswoman in her 30s, warm smile, wearing elegant navy suit, professional studio background, soft lighting, sharp focus, 8K quality, cinematic style`,
    tags: ['人物', '肖像', '写实']
  },
  {
    id: 11,
    title: '风景场景生图',
    category: '生图',
    description: '生成壮丽的自然风景',
    content: `[场景描述], [时间], [天气], [视角], [氛围], [风格]landscape, [画质]quality

示例：
Majestic mountain range at sunrise, golden light piercing through clouds, reflection in crystal clear lake, dramatic sky, wide angle view, photorealistic, 8K, HDR, cinematic composition`,
    tags: ['风景', '自然', '写实']
  },
  {
    id: 12,
    title: '二次元风格生图',
    category: '生图',
    description: '生成动漫/二次元风格图片',
    content: `[角色描述], anime style, [服装], [动作], [背景], [表情], [色调], detailed, vibrant colors

示例：
Cute anime girl with pink hair, wearing school uniform, standing under cherry blossom tree, gentle smile, soft pink petals falling, kawaii style, detailed illustration, pastel colors`,
    tags: ['动漫', '二次元', '插画']
  },
  {
    id: 13,
    title: '产品设计生图',
    category: '生图',
    description: '生成产品渲染图',
    content: `[产品描述], product photography, [材质], [颜色], [背景], [光影], 3D render, [画质], studio lighting

示例：
Modern minimalist smartphone design, sleek metal body in space gray, floating on pure white background, soft studio lighting, product photography, 4K, professional render, octane render`,
    tags: ['产品', '设计', '渲染']
  },
  {
    id: 14,
    title: '国风插画生图',
    category: '生图',
    description: '生成中国风插画',
    content: `[主体描述], Chinese traditional painting style, [元素], [色调], ink wash painting, elegant, [氛围]

示例：
Elegant Chinese lady in hanfu, playing guqin in traditional pavilion, surrounded by lotus flowers, misty mountains in background, Chinese ink wash painting style, soft pastel colors, serene atmosphere`,
    tags: ['国风', '水墨', '传统']
  },
  {
    id: 15,
    title: 'Sora视频生成提示词',
    category: '生视频',
    description: 'OpenAI Sora视频生成模板',
    content: `[场景描述], [动作描述], [运镜方式], [氛围], [时长]duration, [风格]

示例：
A golden retriever running through a field of sunflowers, slow motion, camera following from behind, warm afternoon light, joyful atmosphere, cinematic quality, 10 seconds clip`,
    tags: ['Sora', '视频', 'AI视频']
  },
  {
    id: 16,
    title: '人物动作视频',
    category: '生视频',
    description: '生成人物动作视频',
    content: `A [人物描述] [动作描述], [场景], [光影], [运镜], [氛围], high quality video

示例：
A young woman in white dress dancing gracefully in a sunlit meadow, slow motion, camera circling around her, golden hour lighting, dreamy atmosphere, cinematic quality, smooth motion`,
    tags: ['人物', '动作', '舞蹈']
  },
  {
    id: 17,
    title: '场景转场视频',
    category: '生视频',
    description: '生成场景转换效果',
    content: `[起始场景] transitioning to [目标场景], [转场方式], [氛围变化], smooth transition, cinematic

示例：
Sunset over ocean waves, transitioning to starry night sky, time-lapse effect, peaceful to mysterious atmosphere, smooth cinematic transition, 4K quality`,
    tags: ['转场', '场景', '特效']
  },
  {
    id: 18,
    title: '自然风光视频',
    category: '生视频',
    description: '生成自然风光延时视频',
    content: `[自然场景], time-lapse, [时间变化], [天气变化], cinematic drone shot, [氛围], 4K quality

示例：
Majestic waterfall in lush rainforest, time-lapse from dawn to dusk, changing light, rainbow forming in mist, drone aerial shot, peaceful nature documentary style, 4K cinematic`,
    tags: ['自然', '延时', '航拍']
  },
  {
    id: 19,
    title: '产品展示视频',
    category: '生视频',
    description: '生成产品宣传视频',
    content: `[产品描述], product showcase, [动作/旋转], [背景], studio lighting, professional, [风格]

示例：
Luxury watch rotating slowly on black surface, light reflecting on gold case and diamond bezel, minimalist black background, professional product video, smooth rotation, elegant presentation`,
    tags: ['产品', '展示', '商业']
  },
  {
    id: 20,
    title: '可灵/Runway提示词',
    category: '生视频',
    description: '国内视频生成模型通用模板',
    content: `[主体描述], [动作], [场景], [镜头运动], [氛围], [画质要求]

示例：
可爱的小猫在花园里追逐蝴蝶，阳光透过树叶洒下斑驳光影，镜头跟随小猫移动，温馨治愈的氛围，高清画质，流畅自然`,
    tags: ['可灵', 'Runway', '国内模型']
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
  toast.value?.show('已复制到剪贴板', 'success')
}

const usePrompt = (prompt) => {
  selectedPrompt.value = prompt
  editableContent.value = prompt.content
  showModal.value = true
}
</script>
