<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-4 mb-4">
      <span class="text-sm text-gray-600">时间戳单位:</span>
      <button 
        @click="timestampUnit = 'ms'"
        :class="['px-4 py-1 rounded-lg text-sm', timestampUnit === 'ms' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600']"
      >
        毫秒
      </button>
      <button 
        @click="timestampUnit = 's'"
        :class="['px-4 py-1 rounded-lg text-sm', timestampUnit === 's' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600']"
      >
        秒
      </button>
    </div>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">时间戳 ({{ timestampUnit === 'ms' ? '毫秒' : '秒' }})</label>
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
      <button 
        @click="copyFormatted"
        class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
      >
        复制格式化日期
      </button>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="text-sm text-gray-500 mb-2">转换结果</div>
      <div class="text-lg font-medium text-gray-800">{{ formattedDate }}</div>
      <div class="text-sm text-gray-500 mt-2">
        毫秒: {{ timestampMs }} | 秒: {{ timestampS }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
const timestamp = ref(Date.now())
const datetime = ref('')
const timestampUnit = ref('ms')

const setCurrentTime = () => {
  timestamp.value = Date.now()
}

const timestampMs = computed(() => {
  if (!timestamp.value) return 0
  return timestampUnit.value === 'ms' ? timestamp.value : timestamp.value * 1000
})

const timestampS = computed(() => {
  if (!timestamp.value) return 0
  return timestampUnit.value === 's' ? timestamp.value : Math.floor(timestamp.value / 1000)
})

watch(timestamp, (val) => {
  if (val) {
    const ms = timestampUnit.value === 'ms' ? val : val * 1000
    const d = new Date(ms)
    datetime.value = d.toISOString().slice(0, 16)
  }
}, { immediate: true })

watch(datetime, (val) => {
  if (val) {
    const ms = new Date(val).getTime()
    timestamp.value = timestampUnit.value === 'ms' ? ms : Math.floor(ms / 1000)
  }
})

watch(timestampUnit, (unit) => {
  if (timestamp.value) {
    if (unit === 's') {
      timestamp.value = Math.floor(timestamp.value / 1000)
    } else {
      timestamp.value = timestamp.value * 1000
    }
  }
})

const formattedDate = computed(() => {
  if (!timestamp.value) return ''
  const ms = timestampUnit.value === 'ms' ? timestamp.value : timestamp.value * 1000
  const d = new Date(ms)
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
  const value = timestampUnit.value === 'ms' ? timestampMs.value : timestampS.value
  await navigator.clipboard.writeText(String(value))
  ElMessage.success('已复制时间戳')
}

const copyFormatted = async () => {
  await navigator.clipboard.writeText(formattedDate.value)
  ElMessage.success('已复制格式化日期')
}
