<template>
  <div>
    <div :class="['rounded-2xl shadow-sm p-6', isDark ? 'bg-gray-800' : 'bg-white']">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-gray-800']">Skills 商店</h1>
          <p :class="['mt-1', isDark ? 'text-gray-400' : 'text-gray-500']">AI 技能组件库，用于组装工作流和 Agent</p>
        </div>
        <span :class="['text-sm px-3 py-1 rounded-full', isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500']">
          {{ filteredSkills.length }} 个技能
        </span>
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCat = cat"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
            selectedCat === cat 
              ? 'bg-blue-500 text-white' 
              : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          :class="['p-4 rounded-xl border transition-all cursor-pointer hover:shadow-lg', 
            isDark ? 'bg-gray-700 border-gray-600 hover:border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300']"
        >
          <div class="flex items-start justify-between mb-2">
            <span :class="['text-xs px-2 py-1 rounded-full', 
              skill.category === 'AI能力' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
              skill.category === '逻辑' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
              skill.category === '媒体处理' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300' :
              skill.category === '文件' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
              'bg-gray-100 text-gray-600'
            ]">
              {{ skill.category }}
            </span>
          </div>
          <h3 :class="['font-medium mb-1', isDark ? 'text-white' : 'text-gray-800']">{{ skill.name }}</h3>
          <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-500']">{{ skill.description }}</p>
          <div class="mt-3 flex items-center justify-between">
            <span :class="['text-xs', isDark ? 'text-gray-500' : 'text-gray-400']">来源: {{ skill.source.substring(0, 15) }}...</span>
          </div>
        </div>
      </div>

      <div v-if="filteredSkills.length === 0" :class="['text-center py-12', isDark ? 'text-gray-400' : 'text-gray-500']">
        <p class="text-4xl mb-2">🔧</p>
        <p>暂无技能</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'

const isDark = inject('isDark')

const skills = ref([])
const selectedCat = ref('全部')

const categories = ['全部', 'AI能力', '逻辑', '文件', '媒体处理', '触发器']

const filteredSkills = computed(() => {
  if (selectedCat.value === '全部') {
    return skills.value
  }
  return skills.value.filter(s => s.category === selectedCat.value)
})

onMounted(async () => {
  try {
    const res = await fetch('/api/skills')
    skills.value = await res.json()
  } catch (e) {
    console.error('加载技能失败:', e)
  }
})
</script>
