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
    
    <div class="flex space-x-2 overflow-x-auto pb-2">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="category = cat.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
          category === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>
    
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
      <div class="text-sm text-gray-500 mb-2">转换结果</div>
      <div class="text-3xl font-bold text-gray-800">{{ result }}</div>
      <div class="text-sm text-gray-500 mt-2">{{ fromUnit }} → {{ toUnit }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const value = ref(1)
const fromUnit = ref('')
const toUnit = ref('')
const category = ref('length')

const categories = [
  { id: 'length', name: '长度' },
  { id: 'weight', name: '重量' },
  { id: 'temperature', name: '温度' }
]

const units = {
  length: ['米', '千米', '厘米', '毫米', '英寸', '英尺'],
  weight: ['克', '千克', '毫克', '磅', '盎司'],
  temperature: ['摄氏度', '华氏度', '开尔文']
}

const currentUnits = computed(() => units[category.value] || [])

watch(category, () => {
  fromUnit.value = currentUnits.value[0]
  toUnit.value = currentUnits.value[1] || currentUnits.value[0]
}, { immediate: true })

const conversions = {
  length: {
    '米': 1, '千米': 1000, '厘米': 0.01, '毫米': 0.001, '英寸': 0.0254, '英尺': 0.3048
  },
  weight: {
    '克': 1, '千克': 1000, '毫克': 0.001, '磅': 453.592, '盎司': 28.3495
  }
}

const result = computed(() => {
  if (category.value === 'temperature') {
    return convertTemperature()
  }
  
  const conv = conversions[category.value]
  if (!conv || !conv[fromUnit.value] || !conv[toUnit.value]) return '-'
  
  const baseValue = value.value * conv[fromUnit.value]
  return (baseValue / conv[toUnit.value]).toFixed(6).replace(/\.?0+$/, '')
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
</script>
