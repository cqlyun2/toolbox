<template>
  <div class="space-y-6">
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="text-sm text-gray-500 mb-2">生成的UUID</div>
      <div class="font-mono text-lg break-all">{{ uuid }}</div>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <button 
        @click="generate"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        生成新UUID
      </button>
      <button 
        @click="copyUuid"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
        复制
      </button>
      <button 
        @click="generateBatch"
        class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
      >
        批量生成 (5个)
      </button>
    </div>
    
    <div v-if="batch.length" class="space-y-2">
      <div class="text-sm font-medium text-gray-700">批量生成结果</div>
      <div 
        v-for="(u, i) in batch" 
        :key="i"
        class="bg-gray-50 rounded-lg p-3 font-mono text-sm flex justify-between items-center"
      >
        <span>{{ u }}</span>
        <button @click="copyText(u)" class="text-blue-500 hover:underline">复制</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const uuid = ref('')
const batch = ref([])

const generate = () => {
  uuid.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const generateBatch = () => {
  batch.value = Array.from({ length: 5 }, () => 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  )
}

const copyUuid = async () => {
  await navigator.clipboard.writeText(uuid.value)
  alert('已复制')
}

const copyText = async (text) => {
  await navigator.clipboard.writeText(text)
  alert('已复制')
}

onMounted(generate)
</script>
