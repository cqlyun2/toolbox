<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">输入名单（每行一个）</label>
      <textarea v-model="names" rows="6" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="张三&#10;李四&#10;王五&#10;赵六&#10;钱七"></textarea>
    </div>
    <button @click="rollCall" :disabled="!names.trim()" class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400">
      {{ isAnimating ? '抽取中...' : '开始点名' }}
    </button>
    <div v-if="result" class="text-center p-8 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
      <p class="text-sm text-yellow-600 dark:text-yellow-300 mb-2">幸运儿是：</p>
      <p class="text-4xl font-bold text-yellow-600 dark:text-yellow-200 animate-bounce">{{ result }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const names = ref('')
const result = ref('')
const isAnimating = ref(false)
const rollCall = () => {
  if (!names.value.trim()) { ElMessage.warning('请输入名单'); return }
  const list = names.value.split('\n').filter(n => n.trim())
  if (list.length < 2) { ElMessage.warning('至少需要2人'); return }
  isAnimating.value = true
  result.value = ''
  let count = 0
  const interval = setInterval(() => {
    result.value = list[Math.floor(Math.random() * list.length)]
    count++
    if (count > 10) { clearInterval(interval); isAnimating.value = false; ElMessage.success('点名完成！') }
  }, 100)
}
</script>
