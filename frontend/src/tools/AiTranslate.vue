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
    
    <div v-else class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label :class="['block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']">原文</label>
          <select v-model="fromLang" :class="['px-3 py-1 border rounded-lg text-sm', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']">
            <option value="auto">自动检测</option>
            <option value="zh">中文</option>
            <option value="en">英文</option>
            <option value="ja">日文</option>
            <option value="ko">韩文</option>
            <option value="fr">法文</option>
            <option value="de">德文</option>
            <option value="es">西班牙文</option>
          </select>
        </div>
        <textarea 
          v-model="sourceText"
          rows="8"
          :class="['w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          placeholder="输入要翻译的文本..."
        ></textarea>
        <div class="flex space-x-2">
          <button @click="clearApiKey" :class="['text-sm', isDark ? 'text-gray-500' : 'text-gray-400']">更换Key</button>
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label :class="['block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']">翻译结果</label>
          <select v-model="toLang" :class="['px-3 py-1 border rounded-lg text-sm', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']">
            <option value="zh">中文</option>
            <option value="en">英文</option>
            <option value="ja">日文</option>
            <option value="ko">韩文</option>
            <option value="fr">法文</option>
            <option value="de">德文</option>
            <option value="es">西班牙文</option>
          </select>
        </div>
        <div :class="['w-full h-52 px-4 py-3 border rounded-lg overflow-y-auto', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200']">
          <div v-if="loading" class="text-gray-400 animate-pulse">翻译中...</div>
          <div v-else-if="result" class="whitespace-pre-wrap">{{ result }}</div>
          <div v-else :class="isDark ? 'text-gray-500' : 'text-gray-400'">翻译结果将显示在这里</div>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="translate"
            :disabled="loading || !sourceText"
            class="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {{ loading ? '翻译中...' : '翻译' }}
          </button>
          <button 
            @click="copyResult"
            :disabled="!result"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            复制
          </button>
        </div>
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
const fromLang = ref('auto')
const toLang = ref('en')
const loading = ref(false)

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

const langNames = {
  'zh': '中文', 'en': '英文', 'ja': '日文', 'ko': '韩文',
  'fr': '法文', 'de': '德文', 'es': '西班牙文'
}

const translate = async () => {
  if (!sourceText.value.trim() || loading.value) return
  
  loading.value = true
  result.value = ''
  
  const prompt = fromLang.value === 'auto' 
    ? `请将以下文本翻译成${langNames[toLang.value]}，只输出翻译结果：\n\n${sourceText.value}`
    : `请将以下${langNames[fromLang.value]}翻译成${langNames[toLang.value]}，只输出翻译结果：\n\n${sourceText.value}`
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
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
