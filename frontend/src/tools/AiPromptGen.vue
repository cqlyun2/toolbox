<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-700">基础设置</h3>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">主体内容</label>
          <input v-model="subject" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="如：一个美丽的女孩" />
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">风格</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="s in styles" 
              :key="s"
              @click="toggleStyle(s)"
              :class="['px-3 py-1 rounded-full text-sm transition-all',
                       selectedStyles.includes(s) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600']"
            >
              {{ s }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">画质关键词</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="q in qualities" 
              :key="q"
              @click="toggleQuality(q)"
              :class="['px-3 py-1 rounded-full text-sm transition-all',
                       selectedQualities.includes(q) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600']"
            >
              {{ q }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">光线效果</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="l in lightings" 
              :key="l"
              @click="lighting = l"
              :class="['px-3 py-1 rounded-full text-sm transition-all',
                       lighting === l ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600']"
            >
              {{ l }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-gray-600 mb-1">画面比例</label>
          <select v-model="aspectRatio" class="w-full px-4 py-2 border rounded-lg">
            <option value="">不指定</option>
            <option value="--ar 1:1">1:1 正方形</option>
            <option value="--ar 4:3">4:3 标准</option>
            <option value="--ar 16:9">16:9 宽屏</option>
            <option value="--ar 9:16">9:16 竖屏</option>
            <option value="--ar 2:3">2:3 人像</option>
            <option value="--ar 3:2">3:2 风景</option>
          </select>
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-700">生成结果</h3>
          <select v-model="outputFormat" class="text-sm px-3 py-1 border rounded">
            <option value="midjourney">Midjourney</option>
            <option value="stable">Stable Diffusion</option>
          </select>
        </div>
        
        <div class="bg-gray-900 rounded-lg p-4 min-h-[200px]">
          <pre class="text-green-400 text-sm whitespace-pre-wrap break-all">{{ generatedPrompt }}</pre>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="copyPrompt"
            class="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            复制提示词
          </button>
          <button 
            @click="reset"
            class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            重置
          </button>
        </div>
      </div>
    </div>
    
    <div class="border-t pt-6">
      <h3 class="text-sm font-medium text-gray-700 mb-3">预设模板</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button 
          v-for="template in templates" 
          :key="template.name"
          @click="applyTemplate(template)"
          class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left transition-all"
        >
          <div class="text-2xl mb-1">{{ template.icon }}</div>
          <div class="text-sm font-medium">{{ template.name }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const subject = ref('')
const selectedStyles = ref([])
const selectedQualities = ref([])
const lighting = ref('')
const aspectRatio = ref('')
const outputFormat = ref('midjourney')

const styles = ['写实', '动漫', '油画', '水彩', '赛博朋克', '科幻', '奇幻', '复古', '极简', '3D渲染', '像素风', '素描']
const qualities = ['高清', '4K', '8K', '超细节', '电影级', '照片级', '精细', '锐利', 'HDR']
const lightings = ['自然光', '黄金时刻', '蓝色时刻', '霓虹灯', '柔光', '硬光', '逆光', '侧光', '顶光']

const templates = [
  { 
    name: '人物肖像', 
    icon: '👤',
    subject: '一位美丽的年轻女性，长发，微笑',
    styles: ['写实'],
    qualities: ['高清', '照片级'],
    lighting: '柔光'
  },
  { 
    name: '风景大片', 
    icon: '🏔️',
    subject: '壮丽的山脉，湖泊倒影',
    styles: ['写实'],
    qualities: ['8K', '电影级', 'HDR'],
    lighting: '黄金时刻'
  },
  { 
    name: '科幻场景', 
    icon: '🚀',
    subject: '未来城市，飞行汽车，高楼大厦',
    styles: ['科幻', '赛博朋克'],
    qualities: ['超细节', '电影级'],
    lighting: '霓虹灯'
  },
  { 
    name: '奇幻生物', 
    icon: '🐉',
    subject: '一条威严的龙，展翅高飞',
    styles: ['奇幻'],
    qualities: ['高清', '超细节'],
    lighting: '自然光'
  },
  { 
    name: '动漫人物', 
    icon: '🎌',
    subject: '可爱的动漫女孩，校园背景',
    styles: ['动漫'],
    qualities: ['高清', '精细'],
    lighting: '自然光'
  },
  { 
    name: '产品渲染', 
    icon: '📦',
    subject: '现代智能手表，金属质感',
    styles: ['3D渲染'],
    qualities: ['4K', '超细节'],
    lighting: '柔光'
  },
  { 
    name: '概念艺术', 
    icon: '🎨',
    subject: '神秘的古代遗迹，丛林中',
    styles: ['奇幻', '油画'],
    qualities: ['电影级', '超细节'],
    lighting: '蓝色时刻'
  },
  { 
    name: '像素角色', 
    icon: '👾',
    subject: '像素风格的勇士角色',
    styles: ['像素风'],
    qualities: ['精细'],
    lighting: ''
  }
]

const styleMap = {
  '写实': 'realistic, photorealistic',
  '动漫': 'anime style, manga style',
  '油画': 'oil painting, impasto',
  '水彩': 'watercolor painting',
  '赛博朋克': 'cyberpunk, neon lights',
  '科幻': 'sci-fi, futuristic',
  '奇幻': 'fantasy, magical',
  '复古': 'vintage, retro style',
  '极简': 'minimalist, simple',
  '3D渲染': '3D render, octane render',
  '像素风': 'pixel art, 8-bit',
  '素描': 'pencil sketch, drawing'
}

const qualityMap = {
  '高清': 'high definition, HD',
  '4K': '4K, ultra HD',
  '8K': '8K resolution',
  '超细节': 'highly detailed, intricate details',
  '电影级': 'cinematic, movie quality',
  '照片级': 'photorealistic, photo quality',
  '精细': 'fine details, detailed',
  '锐利': 'sharp focus',
  'HDR': 'HDR, high dynamic range'
}

const lightingMap = {
  '自然光': 'natural lighting',
  '黄金时刻': 'golden hour lighting',
  '蓝色时刻': 'blue hour lighting',
  '霓虹灯': 'neon lighting',
  '柔光': 'soft lighting',
  '硬光': 'hard lighting',
  '逆光': 'backlight, rim lighting',
  '侧光': 'side lighting',
  '顶光': 'top lighting'
}

const generatedPrompt = computed(() => {
  if (!subject.value && selectedStyles.value.length === 0 && selectedQualities.value.length === 0) {
    return '请输入主体内容或选择样式...'
  }
  
  const parts = []
  
  if (subject.value) {
    parts.push(subject.value)
  }
  
  selectedStyles.value.forEach(s => {
    if (styleMap[s]) parts.push(styleMap[s])
  })
  
  selectedQualities.value.forEach(q => {
    if (qualityMap[q]) parts.push(qualityMap[q])
  })
  
  if (lighting.value && lightingMap[lighting.value]) {
    parts.push(lightingMap[lighting.value])
  }
  
  let prompt = parts.join(', ')
  
  if (outputFormat.value === 'midjourney' && aspectRatio.value) {
    prompt += ` ${aspectRatio.value}`
  }
  
  return prompt
})

const toggleStyle = (style) => {
  const index = selectedStyles.value.indexOf(style)
  if (index > -1) {
    selectedStyles.value.splice(index, 1)
  } else {
    selectedStyles.value.push(style)
  }
}

const toggleQuality = (quality) => {
  const index = selectedQualities.value.indexOf(quality)
  if (index > -1) {
    selectedQualities.value.splice(index, 1)
  } else {
    selectedQualities.value.push(quality)
  }
}

const applyTemplate = (template) => {
  subject.value = template.subject
  selectedStyles.value = [...template.styles]
  selectedQualities.value = [...template.qualities]
  lighting.value = template.lighting
}

const copyPrompt = async () => {
  if (generatedPrompt.value && !generatedPrompt.value.includes('请输入')) {
    await navigator.clipboard.writeText(generatedPrompt.value)
    alert('已复制到剪贴板')
  }
}

const reset = () => {
  subject.value = ''
  selectedStyles.value = []
  selectedQualities.value = []
  lighting.value = ''
  aspectRatio.value = ''
}
</script>
