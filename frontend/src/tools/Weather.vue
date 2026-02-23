<template>
  <div class="space-y-6">
    <div class="flex space-x-4">
      <input 
        v-model="city"
        @keyup.enter="search"
        type="text" 
        placeholder="输入城市名称，如：北京、上海"
        class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button 
        @click="search"
        :disabled="loading"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
      >
        {{ loading ? '查询中...' : '查询' }}
      </button>
    </div>
    
    <div v-if="error" class="p-4 bg-red-50 rounded-lg text-red-600">
      {{ error }}
    </div>
    
    <div v-if="weather && !loading" class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-3xl font-bold">{{ weather.city }}</div>
          <div class="text-lg opacity-80 mt-1">{{ weather.date }}</div>
        </div>
        <div class="text-right">
          <div class="text-6xl font-light">{{ weather.temp }}°</div>
          <div class="text-lg mt-1">{{ weather.weather }}</div>
        </div>
      </div>
      
      <div class="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
        <div class="text-center">
          <div class="text-sm opacity-70">风向</div>
          <div class="font-medium mt-1">{{ weather.wind }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm opacity-70">风力</div>
          <div class="font-medium mt-1">{{ weather.windPower }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm opacity-70">湿度</div>
          <div class="font-medium mt-1">{{ weather.humidity }}%</div>
        </div>
        <div class="text-center">
          <div class="text-sm opacity-70">空气质量</div>
          <div class="font-medium mt-1">{{ weather.airQuality }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="forecast.length > 0" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-800">未来几天</h3>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="(day, index) in forecast" :key="index"
             class="bg-white border rounded-lg p-4 text-center">
          <div class="text-gray-500 text-sm">{{ day.date }}</div>
          <div class="text-2xl my-2">{{ day.icon }}</div>
          <div class="text-gray-800">{{ day.weather }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ day.temp }}</div>
        </div>
      </div>
    </div>
    
    <div class="text-sm text-gray-400 text-center">
      数据来源于模拟数据，仅供演示
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const city = ref('')
const loading = ref(false)
const error = ref('')
const weather = ref(null)
const forecast = ref([])

const weatherIcons = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '⛈️',
  '雷阵雨': '⛈️',
  '小雪': '🌨️',
  '中雪': '🌨️',
  '大雪': '❄️',
  '雾': '🌫️',
  '霾': '🌫️'
}

const mockData = {
  '北京': { temp: 15, weather: '晴', wind: '北风', windPower: '3级', humidity: 45, airQuality: '良' },
  '上海': { temp: 22, weather: '多云', wind: '东南风', windPower: '2级', humidity: 68, airQuality: '优' },
  '广州': { temp: 28, weather: '小雨', wind: '南风', windPower: '2级', humidity: 85, airQuality: '良' },
  '深圳': { temp: 27, weather: '多云', wind: '东风', windPower: '3级', humidity: 80, airQuality: '良' },
  '杭州': { temp: 20, weather: '阴', wind: '东北风', windPower: '2级', humidity: 70, airQuality: '优' },
  '成都': { temp: 18, weather: '多云', wind: '微风', windPower: '1级', humidity: 65, airQuality: '中' },
  '武汉': { temp: 19, weather: '晴', wind: '北风', windPower: '2级', humidity: 55, airQuality: '良' },
  '西安': { temp: 16, weather: '晴', wind: '西北风', windPower: '3级', humidity: 40, airQuality: '良' },
  '南京': { temp: 18, weather: '多云', wind: '东风', windPower: '2级', humidity: 60, airQuality: '优' },
  '重庆': { temp: 20, weather: '阴', wind: '微风', windPower: '1级', humidity: 75, airQuality: '中' }
}

const search = () => {
  if (!city.value.trim()) {
    error.value = '请输入城市名称'
    return
  }
  
  loading.value = true
  error.value = ''
  
  setTimeout(() => {
    const cityName = city.value.trim()
    const data = mockData[cityName]
    
    if (data) {
      const today = new Date()
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      
      weather.value = {
        city: cityName,
        date: `${today.getMonth() + 1}月${today.getDate()}日 ${weekDays[today.getDay()]}`,
        ...data
      }
      
      const weatherTypes = ['晴', '多云', '阴', '小雨']
      forecast.value = []
      for (let i = 1; i <= 4; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() + i)
        const w = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
        const tempBase = data.temp + Math.floor(Math.random() * 6) - 3
        forecast.value.push({
          date: `${d.getMonth() + 1}/${d.getDate()}`,
          icon: weatherIcons[w],
          weather: w,
          temp: `${tempBase - 3}°~${tempBase + 3}°`
        })
      }
    } else {
      const randomTemp = Math.floor(Math.random() * 25) + 5
      const randomWeather = ['晴', '多云', '阴', '小雨'][Math.floor(Math.random() * 4)]
      
      const today = new Date()
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      
      weather.value = {
        city: cityName,
        date: `${today.getMonth() + 1}月${today.getDate()}日 ${weekDays[today.getDay()]}`,
        temp: randomTemp,
        weather: randomWeather,
        wind: ['东风', '南风', '西风', '北风'][Math.floor(Math.random() * 4)],
        windPower: `${Math.floor(Math.random() * 4) + 1}级`,
        humidity: Math.floor(Math.random() * 50) + 30,
        airQuality: ['优', '良', '中'][Math.floor(Math.random() * 3)]
      }
      
      forecast.value = []
    }
    
    loading.value = false
  }, 500)
}
</script>
