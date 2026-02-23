<template>
  <div>
    <router-link to="/" class="text-blue-500 hover:underline mb-4 inline-block">
      ← 返回首页
    </router-link>
    
    <div class="bg-white rounded-2xl shadow-sm p-6 mt-4">
      <div class="flex items-center space-x-4 mb-6">
        <div 
          :class="[
            'w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
            getCategoryColor(tool?.category)
          ]"
        >
          {{ tool?.icon }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ tool?.name }}</h1>
          <p class="text-gray-500 mt-1">{{ tool?.description }}</p>
        </div>
      </div>
      
      <div class="border-t pt-6">
        <component :is="toolComponent" v-if="toolComponent" :tool="tool" />
        <div v-else class="text-center py-12 text-gray-500">
          该工具正在开发中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, shallowRef, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { getToolById, categories } from '../utils/tools'

const route = useRoute()

const tool = computed(() => getToolById(route.params.id))

const toolComponent = shallowRef(null)

const toolComponents = {
  'image-compress': defineAsyncComponent(() => import('../tools/ImageCompress.vue')),
  'image-resize': defineAsyncComponent(() => import('../tools/ImageResize.vue')),
  'image-format': defineAsyncComponent(() => import('../tools/ImageConvert.vue')),
  'image-crop': defineAsyncComponent(() => import('../tools/ImageCrop.vue')),
  'text-count': defineAsyncComponent(() => import('../tools/TextCount.vue')),
  'text-format': defineAsyncComponent(() => import('../tools/JsonFormat.vue')),
  'base64': defineAsyncComponent(() => import('../tools/Base64.vue')),
  'timestamp': defineAsyncComponent(() => import('../tools/Timestamp.vue')),
  'uuid': defineAsyncComponent(() => import('../tools/Uuid.vue')),
  'url-encode': defineAsyncComponent(() => import('../tools/UrlEncode.vue')),
  'qrcode': defineAsyncComponent(() => import('../tools/Qrcode.vue')),
  'color-picker': defineAsyncComponent(() => import('../tools/ColorPicker.vue')),
  'number-base': defineAsyncComponent(() => import('../tools/NumberBase.vue')),
  'unit-convert': defineAsyncComponent(() => import('../tools/UnitConvert.vue')),
  'pdf-to-word': defineAsyncComponent(() => import('../tools/PdfToWord.vue')),
  'word-to-pdf': defineAsyncComponent(() => import('../tools/WordToPdf.vue')),
  'pdf-merge': defineAsyncComponent(() => import('../tools/PdfMerge.vue')),
  'pdf-split': defineAsyncComponent(() => import('../tools/PdfSplit.vue')),
  'weather': defineAsyncComponent(() => import('../tools/Weather.vue')),
  'what-to-eat': defineAsyncComponent(() => import('../tools/WhatToEat.vue')),
  'password': defineAsyncComponent(() => import('../tools/Password.vue')),
  'lottery': defineAsyncComponent(() => import('../tools/Lottery.vue'))
}

if (tool.value && toolComponents[tool.value.id]) {
  toolComponent.value = toolComponents[tool.value.id]
}

const getCategoryColor = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.color : 'bg-gray-500'
}
</script>
