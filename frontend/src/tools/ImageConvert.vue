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
      <p class="text-sm text-gray-400 mt-1">支持 JPG, PNG, WebP, GIF 格式</p>
    </div>
    
    <div v-if="preview" class="space-y-4">
      <div class="flex items-center justify-center space-x-4">
        <span class="text-sm text-gray-600">转换为:</span>
        <button v-for="fmt in formats" :key="fmt"
                @click="targetFormat = fmt"
                :class="['px-4 py-2 rounded-lg font-medium transition-all', 
                         targetFormat === fmt ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600']">
          {{ fmt.toUpperCase() }}
        </button>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">原图 ({{ originalFormat }})</div>
          <img :src="preview" class="w-full rounded-lg border" />
        </div>
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">转换后 ({{ targetFormat.toUpperCase() }})</div>
          <canvas ref="canvas" class="w-full rounded-lg border bg-gray-50"></canvas>
        </div>
      </div>
      
      <div class="flex justify-center">
        <button @click="download" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
          下载 {{ targetFormat.toUpperCase() }} 图片
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const preview = ref('')
const canvas = ref(null)
const originalFormat = ref('')
const targetFormat = ref('png')
const formats = ['png', 'jpeg', 'webp']
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
  preview.value = URL.createObjectURL(file)
  originalFormat.value = file.type.split('/')[1] || 'unknown'
  convert()
}

const convert = () => {
  if (!preview.value || !canvas.value) return
  
  const img = new Image()
  img.onload = () => {
    canvas.value.width = img.width
    canvas.value.height = img.height
    const ctx = canvas.value.getContext('2d')
    ctx.drawImage(img, 0, 0)
  }
  img.src = preview.value
}

watch(targetFormat, convert)

const getMimeType = () => {
  const types = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' }
  return types[targetFormat.value] || 'image/png'
}

const download = () => {
  const a = document.createElement('a')
  a.href = canvas.value.toDataURL(getMimeType(), 0.9)
  a.download = `converted.${targetFormat.value}`
  a.click()
}
</script>
