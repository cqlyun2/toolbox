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
      <p class="text-sm text-gray-400 mt-1">将PDF拆分为多个文件</p>
    </div>
    
    <div v-if="fileInfo" class="space-y-4">
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800">{{ file.name }}</div>
            <div class="text-sm text-gray-500">共 {{ totalPages }} 页</div>
          </div>
          <button @click="loadPages" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            加载页面信息
          </button>
        </div>
      </div>
      
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">拆分方式</label>
          <select v-model="splitMode" class="w-full px-4 py-2 border rounded-lg">
            <option value="range">按页码范围</option>
            <option value="each">每页单独拆分</option>
            <option value="interval">按间隔拆分</option>
          </select>
        </div>
        
        <div v-if="splitMode === 'range'">
          <label class="block text-sm font-medium text-gray-700 mb-2">页码范围 (如: 1-3,5,7-9)</label>
          <input v-model="pageRange" type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="1-3,5,7" />
        </div>
        
        <div v-if="splitMode === 'interval'">
          <label class="block text-sm font-medium text-gray-700 mb-2">每隔几页拆分</label>
          <input v-model.number="interval" type="number" min="1" class="w-full px-4 py-2 border rounded-lg" />
        </div>
      </div>
      
      <div class="flex justify-center">
        <button @click="split" :disabled="splitting"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400">
          {{ splitting ? '拆分中...' : '拆分PDF' }}
        </button>
      </div>
      
      <div v-if="results.length > 0" class="space-y-2">
        <div class="text-sm font-medium text-gray-700">拆分结果：</div>
        <div v-for="(result, index) in results" :key="index"
             class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div class="text-green-600">{{ result.name }}</div>
          <a :href="result.path" download class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
            下载
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
const fileInfo = ref(null)
const totalPages = ref(0)
const splitMode = ref('range')
const pageRange = ref('')
const interval = ref(1)
const splitting = ref(false)
const results = ref([])

const handleFile = (e) => {
  const f = e.target.files[0]
  if (f) {
    file.value = f
    fileInfo.value = true
  }
}

const handleDrop = (e) => {
  const f = e.dataTransfer.files[0]
  if (f && f.type === 'application/pdf') {
    file.value = f
    fileInfo.value = true
  }
}

const loadPages = async () => {
  const formData = new FormData()
  formData.append('pdf', file.value)
  
  try {
    const res = await axios.post('/api/pdf/info', formData)
    totalPages.value = res.data.pages
  } catch (error) {
    alert('获取页面信息失败')
  }
}

const split = async () => {
  if (!file.value) return
  
  splitting.value = true
  results.value = []
  
  const formData = new FormData()
  formData.append('pdf', file.value)
  formData.append('mode', splitMode.value)
  if (splitMode.value === 'range') {
    formData.append('range', pageRange.value)
  } else if (splitMode.value === 'interval') {
    formData.append('interval', interval.value)
  }
  
  try {
    const res = await axios.post('/api/pdf/split', formData)
    results.value = res.data.files
  } catch (error) {
    alert('拆分失败: ' + (error.response?.data?.error || error.message))
  } finally {
    splitting.value = false
  }
}
</script>
