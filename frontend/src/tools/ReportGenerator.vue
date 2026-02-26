<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            报告标题 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：2024年度工会工作报告" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">报告周期</label>
          <input v-model="form.period" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：2024年度" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">工作概述</label>
          <textarea v-model="form.summary" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="本期工作围绕企业发展中心任务..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">重点亮点</label>
          <textarea v-model="form.highlights" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="（一）加强组织建设..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">主要成绩</label>
          <textarea v-model="form.achievements" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="1. 完善工会组织架构&#10;2. 加强工会干部培训"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">存在问题</label>
          <textarea v-model="form.problems" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="在肯定成绩的同时，我们也清醒地认识到..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">下一周期工作计划</label>
          <textarea v-model="form.nextPlan" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="新的一年，我们将继续..."></textarea>
        </div>

        <button @click="generate" :disabled="loading || !form.title" class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400">
          {{ loading ? '生成中...' : '生成报告' }}
        </button>
      </div>
    </div>

    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
      <div class="min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <pre v-if="result" class="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-serif">{{ result }}</pre>
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          <div class="text-center"><p class="text-4xl mb-2">📊</p><p>填写完信息后，点击"生成报告"</p></div>
        </div>
      </div>
      <div v-if="result" class="mt-4 flex gap-3">
        <button @click="copyResult" class="flex-1 py-2 bg-green-500 text-white rounded-lg">复制内容</button>
        <button @click="downloadResult" class="flex-1 py-2 bg-gray-500 text-white rounded-lg">下载文件</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const form = ref({ title: '', period: '', summary: '', highlights: '', achievements: '', problems: '', nextPlan: '' })
const loading = ref(false)
const result = ref('')

const generate = async () => {
  if (!form.value.title) { ElMessage.warning('请输入报告标题'); return }
  
  loading.value = true
  try {
    const res = await request.post('/api/ai/generate', {
      toolType: 'report-generator',
      formData: form.value
    })
    result.value = res.data.content
    ElMessage.success('生成成功！')
  } catch (e) {
    ElMessage.error(e.message || '生成失败')
  } finally {
    loading.value = false
  }
}

const copyResult = () => { navigator.clipboard.writeText(result.value); ElMessage.success('已复制') }
const downloadResult = () => {
  const blob = new Blob([result.value], { type: 'text/plain;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${form.value.title || '工作报告'}.txt`
  a.click()
}
</script>
