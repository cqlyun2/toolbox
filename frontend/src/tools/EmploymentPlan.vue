<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
      <div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">方案标题 <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：2024年就业帮扶服务方案" /></div>
        <div><label class="block text-sm font-medium mb-1">帮扶对象</label>
          <input v-model="form.target" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="困难职工、待业人员" /></div>
        <div><label class="block text-sm font-medium mb-1">服务内容</label>
          <textarea v-model="form.content" rows="3" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="1. 岗位推荐&#10;2. 技能培训&#10;3. 创业扶持"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">活动时间</label>
          <input v-model="form.time" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="2024年全年" /></div>
        <div><label class="block text-sm font-medium mb-1">目标人数</label>
          <input v-model="form.targetNum" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="100人" /></div>
        <div><label class="block text-sm font-medium mb-1">预算金额</label>
          <input v-model="form.budget" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="10万元" /></div>
        <button @click="generate" :disabled="loading || !form.title" class="w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">{{ loading ? '生成中...' : '生成就业服务方案' }}</button>
      </div>
    </div>
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
      <div class="min-h-[400px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><pre v-if="result" class="whitespace-pre-wrap text-sm font-serif">{{ result }}</pre><div v-else class="h-full flex items-center justify-center text-gray-400"><div class="text-center"><p class="text-4xl mb-2">💼</p><p>点击生成就业服务方案</p></div></div></div>
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
const form = ref({ title: '', target: '', content: '', time: '', targetNum: '', budget: '' })
const loading = ref(false)
const result = ref('')
const generate = () => {
  if (!form.value.title) { ElMessage.warning('请输入方案标题'); return }
  loading.value = true
  setTimeout(() => {
    const f = form.value
    result.value = `${f.title}

一、指导思想
深入贯彻落实党中央、国务院关于就业工作的决策部署，帮助${f.target || '就业困难人员'}实现稳定就业。

二、帮扶对象
${f.target || '就业困难人员、失业职工'}

三、工作目标
帮助 ${f.targetNum || '若干'} 名帮扶对象实现就业或创业

四、服务内容
${f.content || '1. 岗位推荐：根据求职者技能和意愿，匹配合适岗位\n2. 技能培训：开展职业技能培训，提升就业能力\n3. 创业扶持：提供创业指导和小额贷款支持\n4. 政策咨询：宣传就业创业政策'}

五、活动时间
${f.time || '2024年1月-12月'}

六、组织分工
工会负责组织实施，人力资源部门配合，基层工会协助落实

七、经费预算
${f.budget || '待定'}元

八、工作要求
1. 高度重视，精心组织
2. 摸清底数，建立台账
3. 精准对接，确保实效
4. 及时总结，推广经验`
    loading.value = false
    ElMessage.success('生成成功！')
  }, 500)
}
const copyResult = () => { navigator.clipboard.writeText(result.value); ElMessage.success('已复制') }
const downloadResult = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.value])); a.download = `${form.value.title}.txt`; a.click() }
</script>
