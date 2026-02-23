<template>
  <div class="space-y-6">
    <div class="text-center space-y-4">
      <div class="text-8xl transition-all duration-300" :class="{ 'scale-110': rolling }">
        {{ currentFood.icon }}
      </div>
      <div class="text-2xl font-bold text-gray-800">{{ currentFood.name }}</div>
      <div class="text-gray-500">{{ currentFood.desc }}</div>
    </div>
    
    <div class="flex justify-center space-x-4">
      <button 
        @click="startRoll"
        :disabled="rolling"
        class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
      >
        {{ rolling ? '决定中...' : '开始选择' }}
      </button>
      <button 
        @click="addCustom"
        class="px-6 py-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
      >
        添加选项
      </button>
    </div>
    
    <div class="border-t pt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-medium text-gray-700">选择分类</h3>
        <div class="flex space-x-2">
          <button 
            v-for="cat in categories" 
            :key="cat.name"
            @click="selectedCategory = cat.name"
            :class="['px-3 py-1 rounded-full text-sm transition-all',
                     selectedCategory === cat.name ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600']"
          >
            {{ cat.icon }} {{ cat.name }}
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-3 md:grid-cols-5 gap-2">
        <div 
          v-for="(food, index) in filteredFoods" 
          :key="index"
          :class="['p-3 rounded-lg text-center cursor-pointer transition-all',
                   currentFood.name === food.name ? 'bg-orange-100 border-2 border-orange-400' : 'bg-gray-50 hover:bg-gray-100']"
          @click="currentFood = food"
        >
          <div class="text-2xl">{{ food.icon }}</div>
          <div class="text-sm text-gray-600 mt-1">{{ food.name }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="customFoods.length > 0" class="border-t pt-6">
      <h3 class="font-medium text-gray-700 mb-4">自定义选项</h3>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="(food, index) in customFoods" 
          :key="index"
          class="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-full"
        >
          <span>{{ food }}</span>
          <button @click="removeCustom(index)" class="text-gray-400 hover:text-red-500">×</button>
        </div>
      </div>
    </div>
    
    <div class="text-center text-sm text-gray-400">
      已有 {{ filteredFoods.length + customFoods.length }} 个选项
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = [
  { name: '全部', icon: '🍽️' },
  { name: '中餐', icon: '🥢' },
  { name: '西餐', icon: '🍝' },
  { name: '快餐', icon: '🍔' },
  { name: '小吃', icon: '🍢' }
]

const foods = [
  { name: '火锅', icon: '🍲', desc: '热气腾腾，聚餐首选', category: '中餐' },
  { name: '麻辣烫', icon: '🌶️', desc: '麻辣鲜香，经济实惠', category: '中餐' },
  { name: '饺子', icon: '🥟', desc: '皮薄馅大，传统美食', category: '中餐' },
  { name: '面条', icon: '🍜', desc: '劲道爽滑，暖心暖胃', category: '中餐' },
  { name: '炒饭', icon: '🍚', desc: '粒粒分明，简单美味', category: '中餐' },
  { name: '盖浇饭', icon: '🍛', desc: '菜饭合一，方便快捷', category: '中餐' },
  { name: '烧烤', icon: '🍖', desc: '烟熏火燎，香气四溢', category: '小吃' },
  { name: '炸鸡', icon: '🍗', desc: '外酥里嫩，快乐源泉', category: '快餐' },
  { name: '汉堡', icon: '🍔', desc: '经典搭配，填饱肚子', category: '快餐' },
  { name: '披萨', icon: '🍕', desc: '芝士拉丝，西式美味', category: '西餐' },
  { name: '寿司', icon: '🍣', desc: '精致小巧，日式风情', category: '西餐' },
  { name: '牛排', icon: '🥩', desc: '鲜嫩多汁，大口吃肉', category: '西餐' },
  { name: '意面', icon: '🍝', desc: '浪漫西餐，优雅用餐', category: '西餐' },
  { name: '沙县小吃', icon: '🥟', desc: '扁肉拌面，经典组合', category: '小吃' },
  { name: '兰州拉面', icon: '🍜', desc: '清汤牛肉，面香四溢', category: '中餐' },
  { name: '黄焖鸡', icon: '🍗', desc: '汤汁浓郁，下饭神器', category: '中餐' },
  { name: '冒菜', icon: '🥘', desc: '一个人的火锅', category: '中餐' },
  { name: '麻辣香锅', icon: '🫕', desc: '干香麻辣，越吃越香', category: '中餐' },
  { name: '煎饼果子', icon: '🥞', desc: '早餐之王，酥脆可口', category: '小吃' },
  { name: '肉夹馍', icon: '🥙', desc: '陕西名吃，肉香馍脆', category: '小吃' }
]

const selectedCategory = ref('全部')
const currentFood = ref({ name: '点击开始', icon: '❓', desc: '让命运决定你今天吃什么' })
const rolling = ref(false)
const customFoods = ref([])

const filteredFoods = computed(() => {
  if (selectedCategory.value === '全部') return foods
  return foods.filter(f => f.category === selectedCategory.value)
})

const startRoll = () => {
  rolling.value = true
  
  const allFoods = [...filteredFoods.value, ...customFoods.value.map(f => ({ name: f, icon: '🍽️', desc: '自定义选项' }))]
  
  let count = 0
  const interval = setInterval(() => {
    currentFood.value = allFoods[Math.floor(Math.random() * allFoods.length)]
    count++
    
    if (count >= 20) {
      clearInterval(interval)
      rolling.value = false
    }
  }, 100)
}

const addCustom = () => {
  const food = prompt('请输入自定义选项：')
  if (food && food.trim()) {
    customFoods.value.push(food.trim())
  }
}

const removeCustom = (index) => {
  customFoods.value.splice(index, 1)
}
</script>
