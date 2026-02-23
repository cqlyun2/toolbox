<template>
  <div class="space-y-4">
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
      <p :class="['text-xs', isDark ? 'text-gray-500' : 'text-gray-400']">API Key 仅保存在本地浏览器，不会上传到服务器</p>
    </div>
    
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-500']">模型:</span>
          <select v-model="model" :class="['px-3 py-1 border rounded-lg text-sm', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']">
            <option value="gpt-3.5-turbo">GPT-3.5</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>
        <button @click="clearApiKey" :class="['text-sm', isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500']">
          更换 API Key
        </button>
      </div>
      
      <div :class="['rounded-lg p-4 h-80 overflow-y-auto space-y-3', isDark ? 'bg-gray-700' : 'bg-gray-50']" ref="chatContainer">
        <div v-for="(msg, index) in messages" :key="index">
          <div v-if="msg.role === 'user'" class="flex justify-end">
            <div class="max-w-[80%] px-4 py-2 rounded-lg bg-blue-500 text-white">
              {{ msg.content }}
            </div>
          </div>
          <div v-else class="flex justify-start">
            <div :class="['max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap', isDark ? 'bg-gray-600 text-white' : 'bg-white border']">
              {{ msg.content }}
            </div>
          </div>
        </div>
        <div v-if="loading" class="flex justify-start">
          <div :class="['px-4 py-2 rounded-lg', isDark ? 'bg-gray-600' : 'bg-white border']">
            <span class="animate-pulse">正在思考...</span>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <input 
          v-model="input"
          @keyup.enter="send"
          type="text"
          :class="['flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200']"
          placeholder="输入消息..."
          :disabled="loading"
        />
        <button 
          @click="send" 
          :disabled="loading || !input"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          发送
        </button>
      </div>
      
      <div class="flex space-x-2">
        <button @click="clearChat" :class="['text-sm', isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500']">
          清空对话
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick, onMounted } from 'vue'

const isDark = inject('isDark')
const apiKey = ref('')
const inputApiKey = ref('')
const model = ref('gpt-3.5-turbo')
const messages = ref([])
const input = ref('')
const loading = ref(false)
const chatContainer = ref(null)

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

const send = async () => {
  if (!input.value.trim() || loading.value) return
  
  const userMessage = input.value.trim()
  messages.value.push({ role: 'user', content: userMessage })
  input.value = ''
  loading.value = true
  
  await nextTick()
  chatContainer.value?.scrollTo(0, chatContainer.value.scrollHeight)
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`
      },
      body: JSON.stringify({
        model: model.value,
        messages: messages.value.map(m => ({ role: m.role, content: m.content }))
      })
    })
    
    const data = await response.json()
    
    if (data.error) {
      messages.value.push({ role: 'assistant', content: `错误: ${data.error.message}` })
    } else {
      messages.value.push({ role: 'assistant', content: data.choices[0].message.content })
    }
  } catch (error) {
    messages.value.push({ role: 'assistant', content: `请求失败: ${error.message}` })
  } finally {
    loading.value = false
    await nextTick()
    chatContainer.value?.scrollTo(0, chatContainer.value.scrollHeight)
  }
}

const clearChat = () => {
  messages.value = []
}
</script>
