<template>
  <div>
    <router-link to="/" class="text-blue-500 hover:underline mb-4 inline-block">
      ← 返回首页
    </router-link>
    
    <h1 class="text-2xl font-bold text-gray-800 mt-4 mb-6">
      {{ category?.name || '分类不存在' }}
    </h1>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ToolCard 
        v-for="tool in categoryTools" 
        :key="tool.id" 
        :tool="tool" 
      />
    </div>
    
    <div v-if="categoryTools.length === 0" class="text-center py-12 text-gray-500">
      该分类下暂无工具
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { categories, getToolsByCategory } from '../utils/tools'
import ToolCard from '../components/ToolCard.vue'

const route = useRoute()

const category = computed(() => {
  return categories.find(c => c.id === route.params.id)
})

const categoryTools = computed(() => {
  return getToolsByCategory(route.params.id)
})
</script>
