<template>
  <div class="space-y-6">
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer"
         @click="$refs.fileInput.click()"
         @dragover.prevent
         @drop.prevent="handleDrop">
      <input ref="fileInput" type="file" accept="image/*" @change="handleFile" class="hidden" />
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-600">点击或拖拽上传图片</p>
      <p class="text-sm text-gray-400 mt-1">支持 JPG, PNG, WebP 格式</p>
    </div>
    
    <div v-if="preview" class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">压缩质量: {{ quality }}%</span>
        <input v-model="quality" type="range" min="10" max="100" class="w-48" />
      </div>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">原图</div>
          <img :src="preview" class="w-full rounded-lg border" />
          <div class="text-sm text-gray-500 mt-1">大小: {{ formatSize(originalSize) }}</div>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">压缩后</div>
          <img :src="compressed" class="w-full rounded-lg border" v-if="compressed" />
          <div class="text-sm text-gray-500 mt-1" v-if="compressedSize">
            大小: {{ formatSize(compressedSize) }}
            <span class="text-green-500 ml-2">节省 {{ savedPercent }}%</span>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center">
        <button @click="download" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
          下载压缩图片
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const preview = ref('')
const compressed = ref('')
const originalSize = ref(0)
const compressedSize = ref(0)
const quality = ref(80)
let originalFile = null

const handleFile = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) processFile(file)
}

const processFile = (file) => {
  originalFile = file
  originalSize.value = file.size
  preview.value = URL.createObjectURL(file)
  compress()
}

const compress = () => {
  if (!preview.value) return
  
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    
    canvas.toBlob((blob) => {
      compressed.value = URL.createObjectURL(blob)
      compressedSize.value = blob.size
    }, 'image/jpeg', quality.value / 100)
  }
  img.src = preview.value
}

watch(quality, compress)

const savedPercent = computed(() => {
  if (!compressedSize.value) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
})

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const download = () => {
  const a = document.createElement('a')
  a.href = compressed.value
  a.download = 'compressed.jpg'
  a.click()
}

import { computed } from 'vue'
</script>
