<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
      <div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">文章标题 <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：五一劳动节活动预告" /></div>
        <div><label class="block text-sm font-medium mb-1">引言/导入</label>
          <textarea v-model="form.intro" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="在这个特别的日子里..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">亮点/重点</label>
          <textarea v-model="form.highlight" rows="3" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="本次活动中我们将..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">详细内容</label>
          <textarea v-model="form.details" rows="4" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="活动流程：&#10;1. ...&#10;2. ..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">结尾</label>
          <textarea v-model="form.conclusion" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="期待您的参与！"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">底部信息</label>
          <input v-model="form.footer" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="XX公司工会" /></div>
        <button @click="generate" :disabled="loading || !form.title" class="w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">{{ loading ? '生成中...' : '生成推文' }}</button>
      </div>
    </div>
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
      <div class="min-h-[400px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><pre v-if="result" class="whitespace-pre-wrap text-sm font-serif">{{ result }}</pre><div v-else class="h-full flex items-center justify-center text-gray-400"><div class="text-center"><p class="text-4xl mb-2">📱</p><p>点击生成公众号推文</p></div></div></div>
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
const form = ref({ title: '', intro: '', highlight: '', details: '', conclusion: '', footer: '' })
const loading = ref(false)
const result = ref('')
const generate = () => {
  if (!form.value.title) { ElMessage.warning('请输入文章标题'); return }
  loading.value = true
  setTimeout(() => {
    const f = form.value
    result.value = `【${f.title}】${f.intro ? '\n\n' + f.intro : ''}

${f.highlight ? '🌟 ' + f.highlight : ''}

${f.details ? f.details : ''}

${f.conclusion || '期待您的参与！'}

${f.footer ? '\n\n—— ' + f.footer : ''}`
    loading.value = false
    ElMessage.success('生成成功！')
  }, 500)
}
const copyResult = () => { navigator.clipboard.writeText(result.value); ElMessage.success('已复制') }
const downloadResult = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.value])); a.download = `${form.value.title}.txt`; a.click() }
</script>
