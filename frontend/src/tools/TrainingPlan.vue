<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
      <div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">培训标题 <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：新员工入职培训方案" /></div>
        <div><label class="block text-sm font-medium mb-1">培训目标</label>
          <textarea v-model="form.goal" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="帮助新员工了解企业文化..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">培训对象</label>
          <input v-model="form.target" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="新入职员工" /></div>
        <div><label class="block text-sm font-medium mb-1">培训时间</label>
          <input v-model="form.time" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="2024年5月" /></div>
        <div><label class="block text-sm font-medium mb-1">培训地点</label>
          <input v-model="form.location" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="公司会议室" /></div>
        <div><label class="block text-sm font-medium mb-1">培训内容</label>
          <textarea v-model="form.content" rows="3" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="1. 企业文化&#10;2. 规章制度&#10;3. 业务技能"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">培训方式</label>
          <textarea v-model="form.method" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="集中授课、实操演练、案例分析"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">考核方式</label>
          <textarea v-model="form.assessment" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="笔试+实操"></textarea></div>
        <button @click="generate" :disabled="loading || !form.title" class="w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">{{ loading ? '生成中...' : '生成培训方案' }}</button>
      </div>
    </div>
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
      <div class="min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><pre v-if="result" class="whitespace-pre-wrap text-sm font-serif">{{ result }}</pre><div v-else class="h-full flex items-center justify-center text-gray-400"><div class="text-center"><p class="text-4xl mb-2">📚</p><p>点击生成培训方案</p></div></div></div>
      <div v-if="result" class="mt-4 flex gap-3">
        <button @click="copyResult" class="flex-1 py-2 bg-green-500 text-white rounded-lg">复制</button>
        <button @click="downloadResult" class="flex-1 py-2 bg-gray-500 text-white rounded-lg">下载</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const form = ref({ title: '', goal: '', target: '', time: '', location: '', content: '', method: '', assessment: '' })
const loading = ref(false)
const result = ref('')
const generate = () => {
  if (!form.value.title) { ElMessage.warning('请输入培训标题'); return }
  loading.value = true
  setTimeout(() => {
    const f = form.value
    result.value = `${f.title}

一、培训目标
${f.goal || '提升员工业务能力和综合素质'}

二、培训对象
${f.target || '待定'}

三、培训时间
${f.time || '待定'}

四、培训地点
${f.location || '待定'}

五、培训内容
${f.content || '1. 企业文化\n2. 规章制度\n3. 业务技能\n4. 安全教育'}

六、培训方式
${f.method || '集中授课、实操演练、案例分析'}

七、培训师资
内部讲师+外部专家

八、考核方式
${f.assessment || '笔试+实操'}

九、经费预算
培训费用：待定
教材费用：待定
其他费用：待定

十、工作要求
1. 高度重视，认真组织
2. 严格考勤，确保效果
3. 及时总结，改进提高`
    loading.value = false
    ElMessage.success('生成成功！')
  }, 500)
}
const copyResult = () => { navigator.clipboard.writeText(result.value); ElMessage.success('已复制') }
const downloadResult = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.value])); a.download = `${form.value.title}.txt`; a.click() }
</script>
