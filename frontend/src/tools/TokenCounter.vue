<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
      <textarea 
        v-model="text"
        rows="8"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="粘贴或输入文本内容..."
      ></textarea>
    </div>
    
    <div class="flex items-center space-x-4">
      <label class="text-sm text-gray-600">模型选择：</label>
      <select v-model="model" class="px-4 py-2 border border-gray-200 rounded-lg">
        <option value="gpt3.5">GPT-3.5</option>
        <option value="gpt4">GPT-4</option>
        <option value="gpt4o">GPT-4o</option>
        <option value="claude">Claude</option>
      </select>
    </div>
    
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="text-sm opacity-80">Token 数量</div>
        <div class="text-4xl font-bold mt-2">{{ tokenCount }}</div>
      </div>
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div class="text-sm opacity-80">字符数量</div>
        <div class="text-4xl font-bold mt-2">{{ charCount }}</div>
      </div>
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div class="text-sm opacity-80">预计费用</div>
        <div class="text-4xl font-bold mt-2">${{ estimatedCost }}</div>
      </div>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4">
      <h3 class="text-sm font-medium text-gray-700 mb-3">详细统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span class="text-gray-500">中文字符：</span>
          <span class="font-medium">{{ chineseCount }}</span>
        </div>
        <div>
          <span class="text-gray-500">英文单词：</span>
          <span class="font-medium">{{ englishCount }}</span>
        </div>
        <div>
          <span class="text-gray-500">数字：</span>
          <span class="font-medium">{{ numberCount }}</span>
        </div>
        <div>
          <span class="text-gray-500">标点符号：</span>
          <span class="font-medium">{{ punctuationCount }}</span>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4">
      <h3 class="text-sm font-medium text-gray-700 mb-3">费用说明</h3>
      <div class="text-sm text-gray-600 space-y-1">
        <p v-if="model === 'gpt3.5'">GPT-3.5: 输入 $0.0005/1K tokens, 输出 $0.0015/1K tokens</p>
        <p v-else-if="model === 'gpt4'">GPT-4: 输入 $0.03/1K tokens, 输出 $0.06/1K tokens</p>
        <p v-else-if="model === 'gpt4o'">GPT-4o: 输入 $0.005/1K tokens, 输出 $0.015/1K tokens</p>
        <p v-else>Claude: 输入 $0.003/1K tokens, 输出 $0.015/1K tokens</p>
        <p class="text-xs text-gray-400 mt-2">* Token估算是近似值，实际以API返回为准</p>
      </div>
    </div>
    
    <div class="flex space-x-3">
      <button @click="clearText" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
        清空
      </button>
      <button @click="pasteText" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        粘贴文本
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const toast = inject('toast')
const text = ref('')
const model = ref('gpt4o')

const charCount = computed(() => text.value.length)

const chineseCount = computed(() => {
  const matches = text.value.match(/[\u4e00-\u9fa5]/g)
  return matches ? matches.length : 0
})

const englishCount = computed(() => {
  const matches = text.value.match(/[a-zA-Z]+/g)
  return matches ? matches.length : 0
})

const numberCount = computed(() => {
  const matches = text.value.match(/\d+/g)
  return matches ? matches.length : 0
})

const punctuationCount = computed(() => {
  const matches = text.value.match(/[，。！？、；：""''（）【】《》,.!?;:'"()\[\]{}]/g)
  return matches ? matches.length : 0
})

const tokenCount = computed(() => {
  if (!text.value) return 0
  
  let tokens = 0
  const t = text.value
  
  const chineseChars = t.match(/[\u4e00-\u9fa5]/g)
  tokens += chineseChars ? chineseChars.length * 1.5 : 0
  
  const englishWords = t.match(/[a-zA-Z]+/g)
  tokens += englishWords ? englishWords.reduce((sum, word) => sum + Math.ceil(word.length / 4), 0) : 0
  
  const numbers = t.match(/\d+/g)
  tokens += numbers ? numbers.reduce((sum, num) => sum + Math.ceil(num.length / 3), 0) : 0
  
  const other = t.length - (chineseChars?.length || 0) - (englishWords?.join('').length || 0) - (numbers?.join('').length || 0)
  tokens += Math.ceil(other / 4)
  
  return Math.round(tokens)
})

const estimatedCost = computed(() => {
  const costs = {
    'gpt3.5': 0.0005,
    'gpt4': 0.03,
    'gpt4o': 0.005,
    'claude': 0.003
  }
  const cost = (tokenCount.value / 1000) * costs[model.value]
  return cost < 0.01 ? cost.toFixed(6) : cost.toFixed(4)
})

const clearText = () => {
  text.value = ''
}

const pasteText = async () => {
  try {
    const clipText = await navigator.clipboard.readText()
    text.value = clipText
    toast.value?.show('已粘贴文本', 'success')
  } catch {
    toast.value?.show('无法读取剪贴板', 'error')
  }
}
</script>
