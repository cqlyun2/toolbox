<template>
  <div class="space-y-6">
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer"
         @click="$refs.fileInput.click()"
         @dragover.prevent
         @drop.prevent="handleDrop">
      <input ref="fileInput" type="file" accept=".pdf" @change="handleFile" class="hidden" />
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-600">点击或拖拽上传 PDF 文件</p>
      <p class="text-sm text-gray-400 mt-1">将PDF转换为可编辑的Word文档</p>
    </div>
    
    <div v-if="file" class="space-y-4">
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-3">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div class="font-medium text-gray-800">{{ file.name }}</div>
            <div class="text-sm text-gray-500">{{ formatSize(file.size) }}</div>
          </div>
        </div>
        <button @click="convert" :disabled="converting"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400">
          {{ converting ? '转换中...' : '转换为Word' }}
        </button>
      </div>
      
      <div v-if="result" class="p-4 bg-green-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="text-green-600">转换成功！</div>
          <a :href="result" download class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
            下载 Word
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const file = ref(null)
const converting = ref(false)
const result = ref('')

const handleFile = (e) => {
  const f = e.target.files[0]
  if (f) file.value = f
}

const handleDrop = (e) => {
  const f = e.dataTransfer.files[0]
  if (f && f.type === 'application/pdf') file.value = f
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const convert = async () => {
  if (!file.value) return
  
  converting.value = true
  const formData = new FormData()
  formData.append('pdf', file.value)
  
  try {
    const res = await axios.post('/api/pdf/pdf-to-word', formData)
    result.value = res.data.path
  } catch (error) {
    alert('转换失败: ' + (error.response?.data?.error || error.message))
  } finally {
    converting.value = false
  }
}
</script>
