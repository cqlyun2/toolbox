<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入数值</label>
        <input 
          v-model="inputValue"
          type="text"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          placeholder="输入要转换的数值"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">选择进制</label>
        <select 
          v-model="fromBase"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option :value="2">二进制</option>
          <option :value="8">八进制</option>
          <option :value="10">十进制</option>
          <option :value="16">十六进制</option>
        </select>
      </div>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4 space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-gray-600">二进制:</span>
        <div class="flex items-center gap-2">
          <span class="font-mono">{{ results.binary }}</span>
          <button @click="copyText(results.binary)" class="text-blue-500 text-sm">复制</button>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">八进制:</span>
        <div class="flex items-center gap-2">
          <span class="font-mono">{{ results.octal }}</span>
          <button @click="copyText(results.octal)" class="text-blue-500 text-sm">复制</button>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">十进制:</span>
        <div class="flex items-center gap-2">
          <span class="font-mono">{{ results.decimal }}</span>
          <button @click="copyText(results.decimal)" class="text-blue-500 text-sm">复制</button>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">十六进制:</span>
        <div class="flex items-center gap-2">
          <span class="font-mono">{{ results.hex }}</span>
          <button @click="copyText(results.hex)" class="text-blue-500 text-sm">复制</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputValue = ref('255')
const fromBase = ref(10)

const results = computed(() => {
  try {
    const decimal = parseInt(inputValue.value, fromBase.value)
    if (isNaN(decimal)) return { binary: '-', octal: '-', decimal: '-', hex: '-' }
    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hex: decimal.toString(16).toUpperCase()
    }
  } catch {
    return { binary: '-', octal: '-', decimal: '-', hex: '-' }
  }
})

const copyText = async (text) => {
  await navigator.clipboard.writeText(text)
  alert('已复制')
}
</script>
