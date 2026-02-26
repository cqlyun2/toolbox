<template>
  <router-link 
    :to="`/tool/${tool.id}`"
    :class="['block rounded-2xl p-6 cursor-pointer border transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
             isDark ? 'bg-gray-800/80 border-gray-700/50 hover:border-gray-600' : 'bg-white/80 border-gray-100/50 hover:border-gray-300']"
  >
    <div class="flex flex-col items-center text-center">
      <div 
        :class="[
          'w-18 h-18 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-sm',
          color || getCategoryColor(tool.category)
        ]"
        style="width: 72px; height: 72px;"
      >
        {{ tool.icon }}
      </div>
      <div class="w-full">
        <div class="flex items-center justify-center gap-2">
          <h3 :class="['font-semibold text-lg tracking-wide', isDark ? 'text-white' : 'text-gray-800']">{{ tool.name }}</h3>
          <span 
            v-if="tool.hot" 
            class="px-2 py-0.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 text-xs rounded-full font-medium"
          >
            HOT
          </span>
        </div>
        <p :class="['text-sm mt-3 leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500']">{{ tool.description }}</p>
      </div>
    </div>
    <div v-if="userInfo" class="mt-4 pt-4 border-t border-dashed" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
      <button 
        @click.prevent="toggleFavorite"
        :class="['w-full text-center text-sm flex items-center justify-center gap-1.5 transition-colors', isFavorite ? 'text-amber-500' : (isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500')]"
      >
        {{ isFavorite ? '★ 已收藏' : '☆ 收藏' }}
      </button>
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
  },
  color: {
    type: String,
    default: ''
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
