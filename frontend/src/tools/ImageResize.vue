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
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">选择尺寸</label>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
          <button 
            v-for="preset in presets" 
            :key="preset.label"
            @click="applyPreset(preset)"
            :class="['px-3 py-2 rounded-lg text-sm transition-all',
                     currentPreset?.label === preset.label ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          >
            <div class="font-medium">{{ preset.label }}</div>
            <div class="text-xs opacity-70">{{ preset.width }}×{{ preset.height }}</div>
          </button>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">宽度</label>
          <input v-model.number="width" type="number" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">高度</label>
          <input v-model.number="height" type="number" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">原图 ({{ originalWidth }} × {{ originalHeight }})</div>
          <img :src="preview" class="w-full rounded-lg border" />
        </div>
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">调整后 ({{ width }} × {{ height }})</div>
          <canvas ref="canvas" class="w-full rounded-lg border bg-gray-50"></canvas>
        </div>
      </div>
      
      <div class="flex justify-center">
        <button @click="download" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
          下载图片
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const presets = [
  { label: '原图', width: 0, height: 0 },
  { label: '头像', width: 200, height: 200 },
  { label: '头像大', width: 400, height: 400 },
  { label: '缩略图', width: 150, height: 150 },
  { label: '手机壁纸', width: 1080, height: 1920 },
  { label: '电脑壁纸', width: 1920, height: 1080 },
  { label: '微信封面', width: 900, height: 383 },
  { label: '公众号封面', width: 900, height: 500 },
  { label: '小红书', width: 1242, height: 1660 },
  { label: '抖音封面', width: 1080, height: 1920 },
  { label: '淘宝主图', width: 800, height: 800 },
  { label: '详情页', width: 750, height: 1000 }
]

const preview = ref('')
const canvas = ref(null)
const width = ref(800)
const height = ref(600)
const originalWidth = ref(0)
const originalHeight = ref(0)
const currentPreset = ref(null)
let originalFile = null
let aspectRatio = 1

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
  
  const img = new Image()
  img.onload = () => {
    originalWidth.value = img.width
    originalHeight.value = img.height
    aspectRatio = img.width / img.height
    width.value = img.width
    height.value = img.height
    currentPreset.value = presets[0]
    resize()
  }
  img.src = preview.value
}

const applyPreset = (preset) => {
  currentPreset.value = preset
  if (preset.width === 0 && preset.height === 0) {
    width.value = originalWidth.value
    height.value = originalHeight.value
  } else {
    width.value = preset.width
    height.value = preset.height
  }
  resize()
}

const resize = () => {
  if (!preview.value || !canvas.value) return
  
  const img = new Image()
  img.onload = () => {
    canvas.value.width = width.value
    canvas.value.height = height.value
    const ctx = canvas.value.getContext('2d')
    ctx.drawImage(img, 0, 0, width.value, height.value)
  }
  img.src = preview.value
}

watch(width, () => resize())
watch(height, () => resize())

const download = () => {
  const a = document.createElement('a')
  a.href = canvas.value.toDataURL('image/png')
  a.download = 'resized.png'
  a.click()
}
</script>
