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
      <div class="relative inline-block">
        <img ref="imgRef" :src="preview" class="max-w-full rounded-lg border" @load="onImageLoad" />
        <div class="absolute border-2 border-dashed border-blue-500 bg-blue-500/20"
             :style="cropStyle"
             @mousedown="startDrag"
             @mousemove="onDrag"
             @mouseup="endDrag"></div>
      </div>
      
      <div class="grid md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">X</label>
          <input v-model.number="crop.x" type="number" class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Y</label>
          <input v-model.number="crop.y" type="number" class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">宽度</label>
          <input v-model.number="crop.width" type="number" class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">高度</label>
          <input v-model.number="crop.height" type="number" class="w-full px-4 py-2 border rounded-lg" />
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">预设比例:</span>
        <button v-for="ratio in ratios" :key="ratio.value"
                @click="setRatio(ratio.value)"
                :class="['px-3 py-1 rounded text-sm transition-all',
                         currentRatio === ratio.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600']">
          {{ ratio.label }}
        </button>
      </div>
      
      <div class="flex justify-center">
        <button @click="download" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
          下载裁剪图片
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const preview = ref('')
const imgRef = ref(null)
const crop = ref({ x: 0, y: 0, width: 200, height: 200 })
const currentRatio = ref('free')
const ratios = [
  { label: '自由', value: 'free' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
]

let isDragging = false
let startX = 0, startY = 0
let imgWidth = 0, imgHeight = 0

const cropStyle = computed(() => ({
  left: crop.value.x + 'px',
  top: crop.value.y + 'px',
  width: crop.value.width + 'px',
  height: crop.value.height + 'px'
}))

const handleFile = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) processFile(file)
}

const processFile = (file) => {
  preview.value = URL.createObjectURL(file)
}

const onImageLoad = () => {
  if (imgRef.value) {
    imgWidth = imgRef.value.naturalWidth
    imgHeight = imgRef.value.naturalHeight
    crop.value = { x: 0, y: 0, width: imgRef.value.width / 2, height: imgRef.value.height / 2 }
  }
}

const setRatio = (ratio) => {
  currentRatio.value = ratio
  if (ratio === 'free') return
  
  const [w, h] = ratio.split(':').map(Number)
  const newHeight = crop.value.width * h / w
  crop.value.height = Math.min(newHeight, imgRef.value.height - crop.value.y)
}

const startDrag = (e) => {
  isDragging = true
  startX = e.clientX - crop.value.x
  startY = e.clientY - crop.value.y
}

const onDrag = (e) => {
  if (!isDragging) return
  crop.value.x = Math.max(0, Math.min(e.clientX - startX, imgRef.value.width - crop.value.width))
  crop.value.y = Math.max(0, Math.min(e.clientY - startY, imgRef.value.height - crop.value.height))
}

const endDrag = () => {
  isDragging = false
}

const download = () => {
  const canvas = document.createElement('canvas')
  const scaleX = imgRef.value.naturalWidth / imgRef.value.width
  const scaleY = imgRef.value.naturalHeight / imgRef.value.height
  
  canvas.width = crop.value.width * scaleX
  canvas.height = crop.value.height * scaleY
  
  const ctx = canvas.getContext('2d')
  ctx.drawImage(
    imgRef.value,
    crop.value.x * scaleX,
    crop.value.y * scaleY,
    crop.value.width * scaleX,
    crop.value.height * scaleY,
    0, 0,
    canvas.width,
    canvas.height
  )
  
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = 'cropped.png'
  a.click()
}
</script>
