<template>
  <router-link 
    :to="`/tool/${tool.id}`"
    class="block bg-white rounded-xl p-4 card-hover cursor-pointer border border-gray-100"
  >
    <div class="flex items-start space-x-3">
      <div 
        :class="[
          'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
          getCategoryColor(tool.category)
        ]"
      >
        {{ tool.icon }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <h3 class="font-medium text-gray-800 truncate">{{ tool.name }}</h3>
          <span 
            v-if="tool.hot" 
            class="px-1.5 py-0.5 bg-red-100 text-red-500 text-xs rounded-full"
          >
            hot
          </span>
        </div>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ tool.description }}</p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { categories } from '../utils/tools'

const props = defineProps({
  tool: {
    type: Object,
    required: true
  }
})

const getCategoryColor = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.color : 'bg-gray-500'
}
</script>
