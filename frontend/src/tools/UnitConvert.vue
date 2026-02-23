<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入值</label>
        <input 
          v-model.number="value"
          type="number"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">从</label>
        <select 
          v-model="fromUnit"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option v-for="unit in currentUnits" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">到</label>
        <select 
          v-model="toUnit"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option v-for="unit in currentUnits" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="category = cat.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
          category === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        ]"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>
    
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
      <div class="text-sm text-gray-500 mb-2">转换结果</div>
      <div class="text-3xl font-bold text-gray-800">{{ result }}</div>
      <div class="text-sm text-gray-500 mt-2">{{ fromUnit }} → {{ toUnit }}</div>
    </div>
    
    <button 
      @click="swapUnits"
      class="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
    >
      交换单位
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const value = ref(1)
const fromUnit = ref('')
const toUnit = ref('')
const category = ref('length')

const categories = [
  { id: 'length', name: '长度', icon: '📏' },
  { id: 'weight', name: '重量', icon: '⚖️' },
  { id: 'temperature', name: '温度', icon: '🌡️' },
  { id: 'area', name: '面积', icon: '📐' },
  { id: 'volume', name: '体积', icon: '🧊' },
  { id: 'speed', name: '速度', icon: '🚀' },
  { id: 'data', name: '数据存储', icon: '💾' },
  { id: 'time', name: '时间', icon: '⏱️' }
]

const units = {
  length: ['米', '千米', '厘米', '毫米', '英寸', '英尺', '码', '英里'],
  weight: ['克', '千克', '毫克', '吨', '磅', '盎司', '斤', '两'],
  temperature: ['摄氏度', '华氏度', '开尔文'],
  area: ['平方米', '平方千米', '平方厘米', '公顷', '亩', '平方英尺', '平方英里'],
  volume: ['升', '毫升', '立方米', '立方厘米', '加仑', '品脱'],
  speed: ['米/秒', '千米/时', '英里/时', '节', '马赫'],
  data: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
  time: ['秒', '分钟', '小时', '天', '周', '月', '年']
}

const currentUnits = computed(() => units[category.value] || [])

watch(category, () => {
  fromUnit.value = currentUnits.value[0]
  toUnit.value = currentUnits.value[1] || currentUnits.value[0]
}, { immediate: true })

const conversions = {
  length: {
    '米': 1, '千米': 1000, '厘米': 0.01, '毫米': 0.001, 
    '英寸': 0.0254, '英尺': 0.3048, '码': 0.9144, '英里': 1609.344
  },
  weight: {
    '克': 1, '千克': 1000, '毫克': 0.001, '吨': 1000000, 
    '磅': 453.592, '盎司': 28.3495, '斤': 500, '两': 50
  },
  area: {
    '平方米': 1, '平方千米': 1000000, '平方厘米': 0.0001,
    '公顷': 10000, '亩': 666.667, '平方英尺': 0.0929, '平方英里': 2589988
  },
  volume: {
    '升': 1, '毫升': 0.001, '立方米': 1000, '立方厘米': 0.001,
    '加仑': 3.785, '品脱': 0.473
  },
  speed: {
    '米/秒': 1, '千米/时': 0.2778, '英里/时': 0.447, '节': 0.514, '马赫': 340
  },
  data: {
    'B': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776, 'PB': 1125899906842624
  },
  time: {
    '秒': 1, '分钟': 60, '小时': 3600, '天': 86400, '周': 604800, '月': 2592000, '年': 31536000
  }
}

const result = computed(() => {
  if (category.value === 'temperature') {
    return convertTemperature()
  }
  
  const conv = conversions[category.value]
  if (!conv || !conv[fromUnit.value] || !conv[toUnit.value]) return '-'
  
  const baseValue = value.value * conv[fromUnit.value]
  const res = baseValue / conv[toUnit.value]
  
  if (res < 0.01 || res > 1000000) {
    return res.toExponential(4)
  }
  return res.toFixed(6).replace(/\.?0+$/, '')
})

const convertTemperature = () => {
  const v = value.value
  let celsius = v
  
  if (fromUnit.value === '华氏度') celsius = (v - 32) * 5 / 9
  if (fromUnit.value === '开尔文') celsius = v - 273.15
  
  let result = celsius
  if (toUnit.value === '华氏度') result = celsius * 9 / 5 + 32
  if (toUnit.value === '开尔文') result = celsius + 273.15
  
  return result.toFixed(2)
}

const swapUnits = () => {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
}
