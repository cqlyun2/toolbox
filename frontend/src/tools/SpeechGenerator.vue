<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">发言标题 <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：职代会发言稿" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">发言人</label>
          <input v-model="form.name" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：张三" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">发言人职务</label>
          <input v-model="form.position" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：工会主席" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">开场问候</label>
          <textarea v-model="form.greeting" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="尊敬的各位领导、各位代表：&#10;大家好！"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">主要内容</label>
          <textarea v-model="form.content" rows="4" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="感谢工会的信任，让我有机会在这里发言..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">结束语</label>
          <textarea v-model="form.conclusion" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="谢谢大家！"></textarea>
        </div>
        <button @click="generate" :disabled="loading || !form.title" class="w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">{{ loading ? '生成中...' : '生成发言稿' }}</button>
      </div>
    </div>
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
      <div class="min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <pre v-if="result" class="whitespace-pre-wrap text-sm font-serif">{{ result }}</pre>
        <div v-else class="h-full flex items-center justify-center text-gray-400"><div class="text-center"><p class="text-4xl mb-2">🎤</p><p>点击生成发言稿</p></div></div>
      </div>
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
const form = ref({ title: '', name: '', position: '', greeting: '', content: '', conclusion: '' })
const loading = ref(false)
const result = ref('')
const generate = () => {
  if (!form.value.title) { ElMessage.warning('请输入发言标题'); return }
  loading.value = true
  setTimeout(() => {
    const f = form.value
    result.value = `${f.title}

${f.greeting || '尊敬的各位领导、各位代表：\n\n大家好！'}

${f.content || ''}

${f.conclusion || '\n谢谢大家！'}

${f.name || ''}
${f.position || ''}`
    loading.value = false
    ElMessage.success('生成成功！')
  }, 500)
}
const copyResult = () => { navigator.clipboard.writeText(result.value); ElMessage.success('已复制') }
const downloadResult = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.value])); a.download = `${form.value.title}.txt`; a.click() }
</script>
