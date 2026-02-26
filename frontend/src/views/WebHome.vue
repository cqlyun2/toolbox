<template>
  <div class="flex h-[calc(100vh-120px)]">
    <!-- 左侧分类栏 -->
    <div class="w-56 flex-shrink-0 overflow-y-auto pr-4">
      <div class="space-y-1">
        <button
          v-for="(cat, index) in webCategories"
          :key="cat.name"
          @click="selectedSub = index"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3',
            selectedSub === index 
              ? `${cat.color} text-white font-medium` 
              : (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100')
          ]"
        >
          <span class="text-lg">{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </div>

    <!-- 右侧工具区 -->
    <div class="flex-1 overflow-y-auto">
      <div class="mb-4 flex items-center justify-between">
        <h2 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-gray-800']">
          {{ webCategories[selectedSub].name }}
        </h2>
        <span :class="['text-sm px-3 py-1 rounded-full', isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500']">
          {{ currentTools.length }} 个工具
        </span>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <ToolCard 
          v-for="tool in currentTools" 
          :key="tool.id" 
          :tool="tool"
          :color="webCategories[selectedSub].color"
        />
      </div>
      
      <div v-if="currentTools.length === 0" :class="['text-center py-16', isDark ? 'text-gray-400' : 'text-gray-500']">
        <p class="text-4xl mb-2">📭</p>
        <p>该分类下暂无工具</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { categories, tools } from '../utils/tools'
import ToolCard from '../components/ToolCard.vue'

const isDark = inject('isDark')

const webCategories = [
  { name: '图片工具', icon: '🖼️', color: 'bg-rose-500', category: 'image' },
  { name: 'PDF工具', icon: '📄', color: 'bg-amber-600', category: 'pdf' },
  { name: '文本工具', icon: '📝', color: 'bg-sky-500', category: 'text' },
  { name: '开发工具', icon: '💻', color: 'bg-emerald-500', category: 'dev' },
  { name: '数据换算', icon: '🔢', color: 'bg-amber-500', category: 'data' },
  { name: '生活工具', icon: '🏠', color: 'bg-violet-500', category: 'life' },
  { name: 'AI工具', icon: '🤖', color: 'bg-cyan-500', category: 'ai' },
]

const selectedSub = ref(0)

const currentTools = computed(() => {
  return tools.filter(t => t.category === webCategories[selectedSub.value].category)
})
</script>
