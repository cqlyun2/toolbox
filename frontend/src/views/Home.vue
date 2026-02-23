<template>
  <div>
    <div class="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="selectedCategory = cat.id"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
          selectedCategory === cat.id 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        ]"
      >
        <span class="mr-1">{{ cat.icon }}</span>
        {{ cat.name }}
      </button>
    </div>

    <section v-if="selectedCategory === 'all'">
      <h2 class="text-xl font-bold text-gray-800 mb-4">🔥 热门工具</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <ToolCard 
          v-for="tool in hotTools" 
          :key="tool.id" 
          :tool="tool" 
        />
      </div>
    </section>

    <section>
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        {{ selectedCategory === 'all' ? '全部工具' : getCategoryName(selectedCategory) }}
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ToolCard 
          v-for="tool in displayedTools" 
          :key="tool.id" 
          :tool="tool" 
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue'
import { categories, tools, getToolsByCategory } from '../utils/tools'
import ToolCard from '../components/ToolCard.vue'

const selectedCategory = ref('all')
const searchQuery = inject('searchQuery')

const hotTools = computed(() => tools.filter(t => t.hot))

const displayedTools = computed(() => {
  let result = selectedCategory.value === 'all' 
    ? tools 
    : getToolsByCategory(selectedCategory.value)
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q)
    )
  }
  
  return result
})

const getCategoryName = (id) => {
  const cat = categories.find(c => c.id === id)
  return cat ? cat.name : ''
}
</script>
