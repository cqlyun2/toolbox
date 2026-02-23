<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">时间戳 (毫秒)</label>
        <input 
          v-model.number="timestamp"
          type="number"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="输入时间戳"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">日期时间</label>
        <input 
          v-model="datetime"
          type="datetime-local"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <button 
        @click="setCurrentTime"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        当前时间
      </button>
      <button 
        @click="copyTimestamp"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
        复制时间戳
      </button>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="text-sm text-gray-500 mb-2">转换结果</div>
      <div class="text-lg font-medium text-gray-800">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const timestamp = ref(Date.now())
const datetime = ref('')

const setCurrentTime = () => {
  timestamp.value = Date.now()
}

watch(timestamp, (val) => {
  if (val) {
    const d = new Date(val)
    datetime.value = d.toISOString().slice(0, 16)
  }
}, { immediate: true })

watch(datetime, (val) => {
  if (val) {
    timestamp.value = new Date(val).getTime()
  }
})

const formattedDate = computed(() => {
  if (!timestamp.value) return ''
  const d = new Date(timestamp.value)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long'
  })
})

const copyTimestamp = async () => {
  await navigator.clipboard.writeText(String(timestamp.value))
  alert('已复制时间戳')
}
</script>
