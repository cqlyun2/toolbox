<template>
  <router-link 
    :to="`/tool/${tool.id}`"
    :class="['block rounded-xl p-4 card-hover cursor-pointer border transition-colors duration-300',
             isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']"
  >
    <div class="flex items-start space-x-3">
      <div 
        :class="[
          'w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0',
          getCategoryColor(tool.category)
        ]"
      >
        {{ tool.icon }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <h3 :class="['font-medium truncate', isDark ? 'text-white' : 'text-gray-800']">{{ tool.name }}</h3>
            <span 
              v-if="tool.hot" 
              class="px-1.5 py-0.5 bg-red-100 text-red-500 text-xs rounded-full flex-shrink-0"
            >
              hot
            </span>
          </div>
          <button 
            v-if="userInfo"
            @click.prevent="toggleFavorite"
            :class="['flex-shrink-0', isFavorite ? 'text-yellow-500' : (isDark ? 'text-gray-500' : 'text-gray-300')]"
          >
            {{ isFavorite ? '⭐' : '☆' }}
          </button>
        </div>
        <p :class="['text-sm mt-1 line-clamp-2', isDark ? 'text-gray-400' : 'text-gray-500']">{{ tool.description }}</p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { inject, computed } from 'vue'
import { categories } from '../utils/tools'

const props = defineProps({
  tool: {
    type: Object,
    required: true
  }
})

const isDark = inject('isDark')
const userInfo = inject('user')

const getCategoryColor = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.color : 'bg-gray-500'
}

const favorites = computed(() => {
  const saved = localStorage.getItem('favorites')
  return saved ? JSON.parse(saved) : []
})

const isFavorite = computed(() => {
  return favorites.value.includes(props.tool.id)
})

const toggleFavorite = () => {
  let favs = [...favorites.value]
  if (isFavorite.value) {
    favs = favs.filter(id => id !== props.tool.id)
  } else {
    favs.push(props.tool.id)
  }
  localStorage.setItem('favorites', JSON.stringify(favs))
  window.dispatchEvent(new Event('favorites-changed'))
}
</script>
