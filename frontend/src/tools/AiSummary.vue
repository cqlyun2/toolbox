<template>
  <div class="space-y-6">
    <div v-if="!apiKey" class="text-center py-8 space-y-4">
      <div class="text-4xl">🔑</div>
      <p :class="isDark ? 'text-gray-300' : 'text-gray-600'">请输入您的 OpenAI API Key 开始使用</p>
      <input 
        v-model="inputApiKey"
        type="password"
        :class="['w-full max-w-md mx-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
        placeholder="sk-..."
      />
      <button @click="saveApiKey" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        保存并开始
      </button>
    </div>
    
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <label :class="['block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']">输入长文本</label>
        <div class="flex items-center space-x-4">
          <select v-model="type" :class="['px-3 py-1 border rounded-lg text-sm', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']">
            <option value="summary">摘要</option>
            <option value="keypoints">要点</option>
            <option value="outline">大纲</option>
          </select>
          <button @click="clearApiKey" :class="['text-sm', isDark ? 'text-gray-500' : 'text-gray-400']">更换Key</button>
        </div>
      </div>
      
      <textarea 
        v-model="sourceText"
        rows="8"
        :class="['w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
        placeholder="粘贴需要处理的长文本..."
      ></textarea>
      
      <div class="flex space-x-2">
        <button 
          @click="process"
          :disabled="loading || !sourceText"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {{ loading ? '处理中...' : typeLabels[type] }}
        </button>
      </div>
      
      <div v-if="result">
        <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']">结果</label>
        <div :class="['w-full p-4 border rounded-lg', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200']">
          <div class="whitespace-pre-wrap">{{ result }}</div>
        </div>
        <button @click="copyResult" class="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          复制结果
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'

const isDark = inject('isDark')
const apiKey = ref('')
const inputApiKey = ref('')
const sourceText = ref('')
const result = ref('')
const type = ref('summary')
const loading = ref(false)

const typeLabels = {
  'summary': '生成摘要',
  'keypoints': '提取要点',
  'outline': '生成大纲'
}

const typePrompts = {
  'summary': '请用简洁的语言总结以下内容的核心要点：\n\n',
  'keypoints': '请提取以下内容的关键要点，用分点形式列出：\n\n',
  'outline': '请根据以下内容生成一个清晰的大纲：\n\n'
}

onMounted(() => {
  const savedKey = localStorage.getItem('openai_api_key')
  if (savedKey) {
    apiKey.value = savedKey
  }
})

const saveApiKey = () => {
  if (inputApiKey.value.trim()) {
    apiKey.value = inputApiKey.value.trim()
    localStorage.setItem('openai_api_key', apiKey.value)
    inputApiKey.value = ''
  }
}

const clearApiKey = () => {
  apiKey.value = ''
  localStorage.removeItem('openai_api_key')
}

const process = async () => {
  if (!sourceText.value.trim() || loading.value) return
  
  loading.value = true
  result.value = ''
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: typePrompts[type.value] + sourceText.value }]
      })
    })
    
    const data = await response.json()
    
    if (data.error) {
      result.value = `错误: ${data.error.message}`
    } else {
      result.value = data.choices[0].message.content
    }
  } catch (error) {
    result.value = `请求失败: ${error.message}`
  } finally {
    loading.value = false
  }
}

const copyResult = async () => {
  if (result.value) {
    await navigator.clipboard.writeText(result.value)
    alert('已复制')
  }
}
</script>
