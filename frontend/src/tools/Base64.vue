<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ mode === 'encode' ? '原始文本' : 'Base64文本' }}
        </label>
        <textarea 
          v-model="input"
          class="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          :placeholder="mode === 'encode' ? '输入要编码的文本' : '输入Base64编码'"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ mode === 'encode' ? 'Base64编码' : '解码结果' }}
        </label>
        <textarea 
          v-model="output"
          readonly
          class="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none"
        ></textarea>
      </div>
    </div>
    
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex space-x-2">
        <button 
          @click="mode = 'encode'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            mode === 'encode' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          ]"
        >
          编码
        </button>
        <button 
          @click="mode = 'decode'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            mode === 'decode' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          ]"
        >
          解码
        </button>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="clearAll"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
        >
          清空
        </button>
        <button 
          @click="swapInput"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
        >
          交换
        </button>
        <button 
          @click="copyOutput"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
        >
          复制结果
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const input = ref('')
const mode = ref('encode')

const output = computed(() => {
  if (!input.value) return ''
  try {
    if (mode.value === 'encode') {
      return btoa(unescape(encodeURIComponent(input.value)))
    } else {
      return decodeURIComponent(escape(atob(input.value)))
    }
  } catch (e) {
    return '解码失败: 无效的Base64字符串'
  }
})

const copyOutput = async () => {
  if (output.value && !output.value.startsWith('解码失败')) {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制到剪贴板')
  }
}

const clearAll = () => {
  input.value = ''
}

const swapInput = () => {
  if (output.value && !output.value.startsWith('解码失败')) {
    input.value = output.value
    mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  }
}
</script>
