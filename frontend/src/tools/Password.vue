<template>
  <div class="space-y-6">
    <div class="bg-gray-900 rounded-lg p-6">
      <div class="font-mono text-2xl text-green-400 break-all text-center tracking-wider">
        {{ password || '点击生成密码' }}
      </div>
    </div>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">密码长度: {{ length }}</label>
        <input 
          v-model="length" 
          type="range" 
          min="6" 
          max="32" 
          class="w-full"
        />
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>6</span>
          <span>32</span>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">生成数量: {{ count }}</label>
        <input 
          v-model="count" 
          type="range" 
          min="1" 
          max="10" 
          class="w-full"
        />
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
    
    <div class="space-y-3">
      <h3 class="text-sm font-medium text-gray-700">包含字符</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label class="flex items-center space-x-2 cursor-pointer">
          <input v-model="options.lowercase" type="checkbox" class="rounded text-blue-500" />
          <span class="text-sm">小写字母</span>
          <span class="text-gray-400">a-z</span>
        </label>
        <label class="flex items-center space-x-2 cursor-pointer">
          <input v-model="options.uppercase" type="checkbox" class="rounded text-blue-500" />
          <span class="text-sm">大写字母</span>
          <span class="text-gray-400">A-Z</span>
        </label>
        <label class="flex items-center space-x-2 cursor-pointer">
          <input v-model="options.numbers" type="checkbox" class="rounded text-blue-500" />
          <span class="text-sm">数字</span>
          <span class="text-gray-400">0-9</span>
        </label>
        <label class="flex items-center space-x-2 cursor-pointer">
          <input v-model="options.symbols" type="checkbox" class="rounded text-blue-500" />
          <span class="text-sm">特殊符号</span>
          <span class="text-gray-400">!@#$</span>
        </label>
      </div>
    </div>
    
    <div v-if="options.symbols" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">自定义特殊符号</label>
      <input 
        v-model="customSymbols" 
        type="text" 
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="!@#$%^&*()_+-=[]{}|;:,.<>?"
      />
    </div>
    
    <div class="flex space-x-4">
      <button 
        @click="generate"
        class="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
      >
        生成密码
      </button>
      <button 
        @click="copyPassword"
        :disabled="!password"
        class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:bg-gray-300"
      >
        复制
      </button>
    </div>
    
    <div v-if="passwords.length > 1" class="space-y-2">
      <h3 class="text-sm font-medium text-gray-700">生成的密码列表</h3>
      <div class="space-y-2">
        <div 
          v-for="(pwd, index) in passwords" 
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <code class="text-sm font-mono">{{ pwd }}</code>
          <button 
            @click="copyToClipboard(pwd)"
            class="text-blue-500 hover:text-blue-600 text-sm"
          >
            复制
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="password" class="p-4 bg-blue-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm text-gray-600">密码强度: </span>
          <span :class="strengthClass">{{ strengthText }}</span>
        </div>
        <div class="flex space-x-1">
          <div v-for="i in 4" :key="i"
               :class="['w-6 h-2 rounded', i <= strength ? strengthBarClass : 'bg-gray-200']">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const password = ref('')
const passwords = ref([])
const length = ref(16)
const count = ref(1)
const customSymbols = ref('!@#$%^&*()_+-=')
const options = ref({
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true
})

const generate = () => {
  let chars = ''
  if (options.value.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (options.value.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.value.numbers) chars += '0123456789'
  if (options.value.symbols) chars += customSymbols.value
  
  if (!chars) {
    alert('请至少选择一种字符类型')
    return
  }
  
  passwords.value = []
  for (let c = 0; c < count.value; c++) {
    let pwd = ''
    for (let i = 0; i < length.value; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    passwords.value.push(pwd)
  }
  
  password.value = passwords.value[0]
}

const strength = computed(() => {
  if (!password.value) return 0
  let score = 0
  if (password.value.length >= 8) score++
  if (password.value.length >= 12) score++
  if (/[a-z]/.test(password.value) && /[A-Z]/.test(password.value)) score++
  if (/\d/.test(password.value)) score++
  if (/[^a-zA-Z0-9]/.test(password.value)) score++
  return Math.min(4, score)
})

const strengthText = computed(() => {
  const texts = ['', '弱', '中', '强', '非常强']
  return texts[strength.value]
})

const strengthClass = computed(() => {
  const classes = ['', 'text-red-500', 'text-yellow-500', 'text-green-500', 'text-green-600']
  return classes[strength.value]
})

const strengthBarClass = computed(() => {
  const classes = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
  return classes[strength.value]
})

const copyPassword = async () => {
  if (password.value) {
    await navigator.clipboard.writeText(password.value)
    alert('已复制到剪贴板')
  }
}

const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
  alert('已复制到剪贴板')
}
</script>
