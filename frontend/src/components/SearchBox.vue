<template>
  <div class="relative">
    <input 
      :value="modelValue"
      @input="onInput"
      type="text" 
      :placeholder="placeholder" 
      :class="['w-full px-4 py-2 pl-10 border rounded-full focus:outline-none transition-all', darkMode 
        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
        : 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-500']"
    />
    <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
</template>

<script setup>
import { debounce } from '../utils'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索工具...'
  },
  darkMode: {
    type: Boolean,
    default: false
  },
  delay: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue'])

const debouncedEmit = debounce((value) => {
  emit('update:modelValue', value)
}, props.delay)

const onInput = (e) => {
  debouncedEmit(e.target.value)
}
</script>
