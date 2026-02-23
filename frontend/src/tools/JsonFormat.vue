<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入JSON</label>
        <textarea 
          v-model="input"
          class="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          placeholder='{"name": "test", "value": 123}'
        ></textarea>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700">格式化结果</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">缩进:</span>
            <select v-model="indent" class="px-2 py-1 border rounded text-sm">
              <option :value="2">2空格</option>
              <option :value="4">4空格</option>
              <option :value="1">Tab</option>
            </select>
          </div>
        </div>
        <textarea 
          v-model="output"
          readonly
          class="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none font-mono text-sm"
        ></textarea>
      </div>
    </div>
    
    <div v-if="error" class="p-4 bg-red-50 rounded-lg text-red-600">
      {{ error }}
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex space-x-2">
        <button 
          @click="format"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          格式化
        </button>
        <button 
          @click="compress"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
        >
          压缩
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
import { ref, watch } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')
const indent = ref(2)

const format = () => {
  error.value = ''
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, indent.value)
  } catch (e) {
    error.value = 'JSON格式错误: ' + e.message
    output.value = ''
  }
}

const compress = () => {
  error.value = ''
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = 'JSON格式错误: ' + e.message
    output.value = ''
  }
}

watch([input, indent], () => {
  if (input.value) {
    format()
  } else {
    output.value = ''
    error.value = ''
  }
})

const copyOutput = async () => {
  if (output.value) {
    await navigator.clipboard.writeText(output.value)
    alert('已复制到剪贴板')
  }
}
</script>
