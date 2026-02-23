<template>
  <div>
    <router-link to="/" :class="['hover:underline mb-4 inline-block', isDark ? 'text-blue-400' : 'text-blue-500']">
      ← 返回首页
    </router-link>
    
    <div :class="['rounded-2xl shadow-sm p-6 mt-4 transition-colors duration-300', isDark ? 'bg-gray-800' : 'bg-white']">
      <h1 :class="['text-2xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-800']">⭐ 我的收藏</h1>
      
      <div v-if="favoriteTools.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ToolCard 
          v-for="tool in favoriteTools" 
          :key="tool.id" 
          :tool="tool" 
        />
      </div>
      <div v-else :class="['text-center py-12', isDark ? 'text-gray-400' : 'text-gray-500']">
        <p class="text-4xl mb-4">📭</p>
        <p>还没有收藏任何工具</p>
        <p class="text-sm mt-2">浏览工具时点击 ☆ 即可收藏</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { tools } from '../utils/tools'
import ToolCard from '../components/ToolCard.vue'

const isDark = inject('isDark')
const refreshKey = ref(0)

const favoriteTools = computed(() => {
  refreshKey.value
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  return tools.filter(t => favorites.includes(t.id))
})

onMounted(() => {
  window.addEventListener('favorites-changed', () => {
    refreshKey.value++
  })
})
</script>
