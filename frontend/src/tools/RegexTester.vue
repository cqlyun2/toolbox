<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">正则表达式</label>
      <div class="flex space-x-2">
        <span class="px-3 py-2 bg-gray-100 rounded-l-lg text-gray-500">/</span>
        <input 
          v-model="pattern"
          type="text"
          class="flex-1 px-4 py-2 border-y border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="输入正则表达式"
        />
        <span class="px-3 py-2 bg-gray-100 rounded-r-lg text-gray-500">/{{ flags }}</span>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <span class="text-sm text-gray-500">修饰符:</span>
      <label v-for="flag in flagOptions" :key="flag.value" class="flex items-center space-x-1 cursor-pointer">
        <input type="checkbox" v-model="flag.checked" class="rounded text-blue-500" @change="updateFlags" />
        <span class="text-sm">{{ flag.value }} ({{ flag.label }})</span>
      </label>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">测试文本</label>
      <textarea 
        v-model="testText"
        rows="5"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="输入要测试的文本..."
      ></textarea>
    </div>
    
    <div v-if="error" class="p-4 bg-red-50 rounded-lg text-red-600">
      {{ error }}
    </div>
    
    <div v-if="matches.length > 0">
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">匹配结果 ({{ matches.length }}个)</label>
        <button 
          @click="copyMatches"
          class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-all"
        >
          复制匹配结果
        </button>
      </div>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div 
          v-for="(match, index) in matches" 
          :key="index"
          class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
        >
          <div>
            <span class="text-gray-500 text-sm mr-2">#{{ index + 1 }}</span>
            <code class="bg-yellow-100 px-2 py-1 rounded">{{ match[0] }}</code>
          </div>
          <span class="text-xs text-gray-400">位置: {{ match.index }}</span>
        </div>
      </div>
    </div>
    
    <div v-else-if="pattern && testText && !error" class="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
      没有匹配结果
    </div>
    
    <div class="border-t pt-4">
      <h3 class="text-sm font-medium text-gray-700 mb-3">常用正则表达式</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <button 
          v-for="preset in presets" 
          :key="preset.name"
          @click="applyPreset(preset)"
          class="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-all text-left"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'

const toast = inject('toast')
const pattern = ref('')
const flags = ref('g')
const testText = ref('')
const error = ref('')

const flagOptions = ref([
  { value: 'g', label: '全局', checked: true },
  { value: 'i', label: '忽略大小写', checked: false },
  { value: 'm', label: '多行', checked: false },
  { value: 's', label: '包含换行', checked: false }
])

const presets = [
  { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: '手机号', pattern: '1[3-9]\\d{9}' },
  { name: '身份证号', pattern: '\\d{17}[\\dXx]' },
  { name: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*' },
  { name: 'IP地址', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
  { name: '日期', pattern: '\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}' },
  { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+' },
  { name: '数字', pattern: '\\d+' },
  { name: '空白字符', pattern: '\\s+' }
]

const updateFlags = () => {
  flags.value = flagOptions.value.filter(f => f.checked).map(f => f.value).join('')
}

const matches = computed(() => {
  if (!pattern.value || !testText.value) return []
  
  try {
    error.value = ''
    const regex = new RegExp(pattern.value, flags.value)
    const results = []
    let match
    
    if (flags.value.includes('g')) {
      while ((match = regex.exec(testText.value)) !== null) {
        results.push({ 0: match[0], index: match.index })
        if (match[0] === '') break
      }
    } else {
      match = regex.exec(testText.value)
      if (match) {
        results.push({ 0: match[0], index: match.index })
      }
    }
    
    return results
  } catch (e) {
    error.value = '正则表达式错误: ' + e.message
    return []
  }
})

const applyPreset = (preset) => {
  pattern.value = preset.pattern
  toast.value?.show(`已应用: ${preset.name}`, 'success')
}

const copyMatches = async () => {
  if (matches.value.length > 0) {
    const text = matches.value.map(m => m[0]).join('\n')
    await navigator.clipboard.writeText(text)
    toast.value?.show('已复制匹配结果', 'success')
  }
}
