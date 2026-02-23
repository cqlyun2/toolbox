<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">抽奖名单（每行一个）</label>
        <textarea 
          v-model="names"
          class="w-full h-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="张三&#10;李四&#10;王五&#10;..."
        ></textarea>
        <div class="text-sm text-gray-400 mt-1">{{ nameList.length }} 人参与</div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">抽奖设置</label>
        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-600">抽取人数</label>
            <input 
              v-model.number="winnerCount" 
              type="number" 
              min="1" 
              class="w-full px-4 py-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label class="text-sm text-gray-600">抽奖方式</label>
            <select v-model="mode" class="w-full px-4 py-2 border rounded-lg mt-1">
              <option value="single">一次性抽取</option>
              <option value="sequential">逐个抽取</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <input v-model="allowRepeat" type="checkbox" id="allowRepeat" class="rounded" />
            <label for="allowRepeat" class="text-sm text-gray-600">允许重复中奖</label>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center space-x-4">
      <button 
        @click="start"
        :disabled="nameList.length < winnerCount || rolling"
        class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
      >
        {{ rolling ? '抽奖中...' : '开始抽奖' }}
      </button>
      <button 
        @click="reset"
        class="px-6 py-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
      >
        重置
      </button>
    </div>
    
    <div v-if="rolling" class="text-center py-8">
      <div class="text-4xl font-bold text-purple-600 animate-pulse">
        {{ currentName }}
      </div>
    </div>
    
    <div v-if="winners.length > 0" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-800 text-center">🎉 中奖名单 🎉</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(winner, index) in winners" 
          :key="index"
          class="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4 text-center text-white"
        >
          <div class="text-3xl mb-2">🏆</div>
          <div class="font-medium">{{ winner }}</div>
          <div class="text-sm opacity-80">第 {{ index + 1 }} 名</div>
        </div>
      </div>
    </div>
    
    <div v-if="history.length > 0" class="border-t pt-6">
      <h3 class="text-sm font-medium text-gray-700 mb-4">抽奖历史</h3>
      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div 
          v-for="(record, index) in history" 
          :key="index"
          class="text-sm text-gray-500 p-2 bg-gray-50 rounded"
        >
          {{ record }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const names = ref('')
const winnerCount = ref(1)
const mode = ref('single')
const allowRepeat = ref(false)
const rolling = ref(false)
const currentName = ref('')
const winners = ref([])
const history = ref([])

const nameList = computed(() => {
  return names.value
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0)
})

const start = () => {
  if (nameList.value.length < winnerCount.value) return
  
  winners.value = []
  
  if (mode.value === 'single') {
    drawAll()
  } else {
    drawSequential()
  }
}

const drawAll = () => {
  rolling.value = true
  let count = 0
  const available = allowRepeat.value ? [...nameList.value] : [...nameList.value]
  
  const interval = setInterval(() => {
    currentName.value = available[Math.floor(Math.random() * available.length)]
    count++
    
    if (count >= 30) {
      clearInterval(interval)
      rolling.value = false
      
      const pool = allowRepeat.value ? [...nameList.value] : [...nameList.value]
      for (let i = 0; i < winnerCount.value && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length)
        winners.value.push(pool[idx])
        if (!allowRepeat.value) pool.splice(idx, 1)
      }
      
      history.value.unshift(`[${new Date().toLocaleTimeString()}] 抽取 ${winnerCount.value} 人: ${winners.value.join(', ')}`)
    }
  }, 80)
}

const drawSequential = async () => {
  const pool = allowRepeat.value ? [...nameList.value] : [...nameList.value]
  
  for (let i = 0; i < winnerCount.value && pool.length > 0; i++) {
    rolling.value = true
    let count = 0
    
    await new Promise(resolve => {
      const interval = setInterval(() => {
        currentName.value = pool[Math.floor(Math.random() * pool.length)]
        count++
        
        if (count >= 20) {
          clearInterval(interval)
          rolling.value = false
          
          const idx = Math.floor(Math.random() * pool.length)
          winners.value.push(pool[idx])
          if (!allowRepeat.value) pool.splice(idx, 1)
          
          resolve()
        }
      }, 80)
    })
    
    await new Promise(r => setTimeout(r, 300))
  }
  
  history.value.unshift(`[${new Date().toLocaleTimeString()}] 逐个抽取 ${winnerCount.value} 人: ${winners.value.join(', ')}`)
}

const reset = () => {
  names.value = ''
  winners.value = []
  currentName.value = ''
}
</script>
