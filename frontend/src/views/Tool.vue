<template>
  <div>
    <router-link to="/" :class="['hover:underline mb-4 inline-block', isDark ? 'text-blue-400' : 'text-blue-500']">
      ← 返回首页
    </router-link>
    
    <div :class="['rounded-2xl shadow-sm p-6 mt-4 transition-colors duration-300', isDark ? 'bg-gray-800' : 'bg-white']">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div 
            :class="[
              'w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
              getCategoryColor(tool?.category)
            ]"
          >
            {{ tool?.icon }}
          </div>
          <div>
            <h1 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-gray-800']">{{ tool?.name }}</h1>
            <p :class="['mt-1', isDark ? 'text-gray-400' : 'text-gray-500']">{{ tool?.description }}</p>
          </div>
        </div>
        <button 
          v-if="tool"
          @click="toggleFavorite"
          :class="['text-2xl transition-all', isFavorite ? 'text-yellow-500' : (isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-300 hover:text-gray-400')]"
          :title="isFavorite ? '取消收藏' : '添加收藏'"
        >
          {{ isFavorite ? '⭐' : '☆' }}
        </button>
      </div>
      
      <div :class="['border-t pt-6', isDark ? 'border-gray-700' : 'border-gray-100']">
        <component :is="toolComponent" v-if="toolComponent" :tool="tool" />
        <div v-else :class="['text-center py-12', isDark ? 'text-gray-400' : 'text-gray-500']">
          该工具正在开发中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, shallowRef, defineAsyncComponent, inject, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getToolById, categories } from '../utils/tools'

const route = useRoute()
const isDark = inject('isDark')
const user = inject('user')

const tool = computed(() => getToolById(route.params.id))

const toolComponent = shallowRef(null)

const toolComponents = {
  'image-compress': defineAsyncComponent(() => import('../tools/ImageCompress.vue')),
  'image-resize': defineAsyncComponent(() => import('../tools/ImageResize.vue')),
  'image-format': defineAsyncComponent(() => import('../tools/ImageConvert.vue')),
  'image-crop': defineAsyncComponent(() => import('../tools/ImageCrop.vue')),
  'text-count': defineAsyncComponent(() => import('../tools/TextCount.vue')),
  'text-format': defineAsyncComponent(() => import('../tools/JsonFormat.vue')),
  'base64': defineAsyncComponent(() => import('../tools/Base64.vue')),
  'timestamp': defineAsyncComponent(() => import('../tools/Timestamp.vue')),
  'uuid': defineAsyncComponent(() => import('../tools/Uuid.vue')),
  'url-encode': defineAsyncComponent(() => import('../tools/UrlEncode.vue')),
  'qrcode': defineAsyncComponent(() => import('../tools/Qrcode.vue')),
  'color-picker': defineAsyncComponent(() => import('../tools/ColorPicker.vue')),
  'number-base': defineAsyncComponent(() => import('../tools/NumberBase.vue')),
  'unit-convert': defineAsyncComponent(() => import('../tools/UnitConvert.vue')),
  'pdf-to-word': defineAsyncComponent(() => import('../tools/PdfToWord.vue')),
  'word-to-pdf': defineAsyncComponent(() => import('../tools/WordToPdf.vue')),
  'pdf-merge': defineAsyncComponent(() => import('../tools/PdfMerge.vue')),
  'pdf-split': defineAsyncComponent(() => import('../tools/PdfSplit.vue')),
  'weather': defineAsyncComponent(() => import('../tools/Weather.vue')),
  'what-to-eat': defineAsyncComponent(() => import('../tools/WhatToEat.vue')),
  'password': defineAsyncComponent(() => import('../tools/Password.vue')),
  'lottery': defineAsyncComponent(() => import('../tools/Lottery.vue')),
  'prompt-library': defineAsyncComponent(() => import('../tools/PromptLibrary.vue')),
  'token-counter': defineAsyncComponent(() => import('../tools/TokenCounter.vue')),
  'ai-prompt-gen': defineAsyncComponent(() => import('../tools/AiPromptGen.vue')),
  'prompt-optimizer': defineAsyncComponent(() => import('../tools/PromptOptimizer.vue')),
  'lorem-gen': defineAsyncComponent(() => import('../tools/LoremGen.vue')),
  'regex-tester': defineAsyncComponent(() => import('../tools/RegexTester.vue')),
  'hash-gen': defineAsyncComponent(() => import('../tools/HashGen.vue')),
  'notice-generator': defineAsyncComponent(() => import('../tools/NoticeGenerator.vue')),
  'report-generator': defineAsyncComponent(() => import('../tools/ReportGenerator.vue')),
  'speech-generator': defineAsyncComponent(() => import('../tools/SpeechGenerator.vue')),
  'activity-plan': defineAsyncComponent(() => import('../tools/ActivityPlan.vue')),
  'training-plan': defineAsyncComponent(() => import('../tools/TrainingPlan.vue')),
  'employment-plan': defineAsyncComponent(() => import('../tools/EmploymentPlan.vue')),
  'wechat-assistant': defineAsyncComponent(() => import('../tools/WechatAssistant.vue')),
  'video-script': defineAsyncComponent(() => import('../tools/VideoScript.vue')),
  'team-shuffle': defineAsyncComponent(() => import('../tools/TeamShuffle.vue')),
  'roll-call': defineAsyncComponent(() => import('../tools/RollCall.vue')),
  'rules-template': defineAsyncComponent(() => import('../tools/RulesTemplate.vue')),
  'labor-law': defineAsyncComponent(() => import('../tools/LaborLaw.vue')),
  'assistance-plan': defineAsyncComponent(() => import('../tools/AssistancePlan.vue')),
  'mental-health': defineAsyncComponent(() => import('../tools/MentalHealth.vue')),
  'fund-management': defineAsyncComponent(() => import('../tools/FundManagement.vue')),
  'evaluation-plan': defineAsyncComponent(() => import('../tools/EvaluationPlan.vue')),
  'team-building': defineAsyncComponent(() => import('../tools/TeamBuilding.vue')),
  'holiday-care': defineAsyncComponent(() => import('../tools/HolidayCare.vue')),
  'model-story': defineAsyncComponent(() => import('../tools/ModelStory.vue')),
  'wage-negotiation': defineAsyncComponent(() => import('../tools/WageNegotiation.vue')),
  'meeting-minutes': defineAsyncComponent(() => import('../tools/MeetingMinutes.vue')),
  'news-release': defineAsyncComponent(() => import('../tools/NewsRelease.vue')),
  'proposal': defineAsyncComponent(() => import('../tools/Proposal.vue')),
  'sympathy-letter': defineAsyncComponent(() => import('../tools/SympathyLetter.vue')),
  'emergency-plan': defineAsyncComponent(() => import('../tools/EmergencyPlan.vue')),
  'collective-contract': defineAsyncComponent(() => import('../tools/CollectiveContract.vue')),
  'budget-report': defineAsyncComponent(() => import('../tools/BudgetReport.vue')),
  'membership': defineAsyncComponent(() => import('../tools/Membership.vue')),
  'labor-protection': defineAsyncComponent(() => import('../tools/LaborProtection.vue'))
}

if (tool.value && toolComponents[tool.value.id]) {
  toolComponent.value = toolComponents[tool.value.id]
}

const getCategoryColor = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.color : 'bg-gray-500'
}

const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

const isFavorite = computed(() => {
  return tool.value && favorites.value.includes(tool.value.id)
})

const toggleFavorite = () => {
  if (!tool.value) return
  let favs = [...favorites.value]
  if (isFavorite.value) {
    favs = favs.filter(id => id !== tool.value.id)
  } else {
    favs.push(tool.value.id)
  }
  favorites.value = favs
  localStorage.setItem('favorites', JSON.stringify(favs))
  window.dispatchEvent(new Event('favorites-changed'))
}

const saveToHistory = () => {
  if (!tool.value) return
  let history = JSON.parse(localStorage.getItem('toolHistory') || '[]')
  history = history.filter(id => id !== tool.value.id)
  history.unshift(tool.value.id)
  history = history.slice(0, 20)
  localStorage.setItem('toolHistory', JSON.stringify(history))
}

watch(tool, () => {
  if (tool.value && toolComponents[tool.value.id]) {
    toolComponent.value = toolComponents[tool.value.id]
  }
  saveToHistory()
})

onMounted(() => {
  saveToHistory()
})
</script>
