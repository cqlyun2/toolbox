<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
      <div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">视频标题 <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：工会活动纪实" /></div>
        <div><label class="block text-sm font-medium mb-1">开场画面</label>
          <textarea v-model="form.open" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="镜头缓缓拉近..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">主体内容</label>
          <textarea v-model="form.main" rows="4" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="活动现场..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">结尾画面</label>
          <textarea v-model="form.ending" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="合影留念..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">字幕内容</label>
          <textarea v-model="form.subtitle" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="劳动最光荣..."></textarea></div>
        <button @click="generate" :disabled="loading || !form.title" class="w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">{{ loading ? '生成中...' : '生成脚本' }}</button>
      </div>
    </div>
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
      <div class="min-h-[400px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><pre v-if="result" class="whitespace-pre-wrap text-sm font-serif">{{ result }}</pre><div v-else class="h-full flex items-center justify-center text-gray-400"><div class="text-center"><p class="text-4xl mb-2">🎬</p><p>点击生成短视频脚本</p></div></div></div>
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
const form = ref({ title: '', open: '', main: '', ending: '', subtitle: '' })
const loading = ref(false)
const result = ref('')
const generate = () => {
  if (!form.value.title) { ElMessage.warning('请输入视频标题'); return }
  loading.value = true
  setTimeout(() => {
    const f = form.value
    result.value = `${f.title}

【开场】
${f.open || '镜头缓缓拉近，画面渐入'}

【主体】
${f.main || '活动现场拍摄，展示精彩瞬间'}

【结尾】
${f.ending || '合影留念，镜头慢慢拉远'}

【字幕】
${f.subtitle || '劳动最光荣'}

【时长建议】
总时长：60-90秒

【配乐建议】
轻快、积极的背景音乐`
    loading.value = false
    ElMessage.success('生成成功！')
  }, 500)
}
const copyResult = () => { navigator.clipboard.writeText(result.value); ElMessage.success('已复制') }
const downloadResult = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.value])); a.download = `${form.value.title}.txt`; a.click() }
</script>
