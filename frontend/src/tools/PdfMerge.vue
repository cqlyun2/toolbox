<template>
  <div class="space-y-6">
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer"
         @click="$refs.fileInput.click()"
         @dragover.prevent
         @drop.prevent="handleDrop">
      <input ref="fileInput" type="file" accept=".pdf" multiple @change="handleFiles" class="hidden" />
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-600">点击或拖拽上传 PDF 文件（至少2个）</p>
      <p class="text-sm text-gray-400 mt-1">按顺序选择多个PDF文件进行合并</p>
    </div>
    
    <div v-if="files.length > 0" class="space-y-4">
      <div class="space-y-2">
        <div v-for="(file, index) in files" :key="index"
             class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">{{ index + 1 }}</span>
            <div>
              <div class="font-medium text-gray-800">{{ file.name }}</div>
              <div class="text-sm text-gray-500">{{ formatSize(file.size) }}</div>
            </div>
          </div>
          <button @click="removeFile(index)" class="text-red-500 hover:text-red-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="flex justify-center space-x-4">
        <button @click="clearFiles" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
          清空列表
        </button>
        <button @click="merge" :disabled="files.length < 2 || merging"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400">
          {{ merging ? '合并中...' : '合并PDF' }}
        </button>
      </div>
      
      <div v-if="result" class="p-4 bg-green-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="text-green-600">合并成功！</div>
          <a :href="result" download class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
            下载合并PDF
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const files = ref([])
const merging = ref(false)
const result = ref('')

const handleFiles = (e) => {
  const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf')
  files.value = [...files.value, ...newFiles]
}

const handleDrop = (e) => {
  const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
  files.value = [...files.value, ...newFiles]
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const clearFiles = () => {
  files.value = []
  result.value = ''
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const merge = async () => {
  if (files.value.length < 2) return
  
  merging.value = true
  const formData = new FormData()
  files.value.forEach(file => {
    formData.append('pdfs', file)
  })
  
  try {
    const res = await axios.post('/api/pdf/merge', formData)
    result.value = res.data.path
  } catch (error) {
    alert('合并失败: ' + (error.response?.data?.error || error.message))
  } finally {
    merging.value = false
  }
}
</script>
