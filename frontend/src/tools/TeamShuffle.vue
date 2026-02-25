<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">输入成员名单（每行一个）</label>
        <textarea v-model="members" rows="8" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="张三&#10;李四&#10;王五&#10;赵六"></textarea>
      </div>
      <div class="w-32">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分成组数</label>
        <input v-model.number="groupCount" type="number" min="2" max="10" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-center text-xl font-bold" />
      </div>
    </div>
    <button @click="shuffle" :disabled="!members.trim()" class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400">开始分组</button>
    <div v-if="groups.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="(group, index) in groups" :key="index" class="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
        <h4 class="font-medium text-green-800 dark:text-green-200 mb-2">第 {{ index + 1 }} 组</h4>
        <ul class="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li v-for="member in group" :key="member">{{ member }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const members = ref('')
const groupCount = ref(3)
const groups = ref([])
const shuffle = () => {
  if (!members.value.trim()) { ElMessage.warning('请输入成员名单'); return }
  const list = members.value.split('\n').filter(m => m.trim())
  if (list.length < groupCount.value) { ElMessage.warning('成员数量不能少于组数'); return }
  const shuffled = [...list].sort(() => Math.random() - 0.5)
  groups.value = Array.from({ length: groupCount.value }, () => [])
  shuffled.forEach((member, index) => { groups.value[index % groupCount.value].push(member) })
  ElMessage.success('分组完成！')
}
</script>
