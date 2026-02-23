<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <input 
        ref="colorInput"
        v-model="hexColor"
        type="color"
        class="w-20 h-20 rounded-lg cursor-pointer border-0"
      />
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">HEX 颜色值</label>
        <input 
          v-model="hexColor"
          type="text"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
    
    <div class="grid md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">RGB</label>
        <input 
          :value="rgbColor"
          readonly
          class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-mono"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">HSL</label>
        <input 
          :value="hslColor"
          readonly
          class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-mono"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">预览</label>
        <div 
          class="w-full h-10 rounded-lg border border-gray-200"
          :style="{ backgroundColor: hexColor }"
        ></div>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <button 
        @click="copyColor(hexColor)"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        复制 HEX
      </button>
      <button 
        @click="copyColor(rgbColor)"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
        复制 RGB
      </button>
      <button 
        @click="randomColor"
        class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
      >
        随机颜色
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const hexColor = ref('#3b82f6')

const rgbColor = computed(() => {
  const hex = hexColor.value.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgb(${r}, ${g}, ${b})`
})

const hslColor = computed(() => {
  const hex = hexColor.value.replace('#', '')
  let r = parseInt(hex.substr(0, 2), 16) / 255
  let g = parseInt(hex.substr(2, 2), 16) / 255
  let b = parseInt(hex.substr(4, 2), 16) / 255
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
})

const copyColor = async (color) => {
  await navigator.clipboard.writeText(color)
  alert('已复制: ' + color)
}

const randomColor = () => {
  const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  hexColor.value = '#' + randomHex
}
</script>
