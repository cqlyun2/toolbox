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
    
    <div class="flex items-center justify-between">
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
      <button 
        @click="copyOutput"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
        复制结果
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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
  if (output.value) {
    await navigator.clipboard.writeText(output.value)
    alert('已复制到剪贴板')
  }
}
</script>
