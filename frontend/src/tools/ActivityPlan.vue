<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
      <div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">策划标题 <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：五一劳动节活动策划方案" /></div>
        <div><label class="block text-sm font-medium mb-1">活动主题</label>
          <input v-model="form.theme" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="例如：劳动最光荣" /></div>
        <div><label class="block text-sm font-medium mb-1">活动时间</label>
          <input v-model="form.time" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="2024年5月1日" /></div>
        <div><label class="block text-sm font-medium mb-1">活动地点</label>
          <input v-model="form.location" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="公司职工活动中心" /></div>
        <div><label class="block text-sm font-medium mb-1">参与对象</label>
          <input v-model="form.participants" type="text" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="全体职工" /></div>
        <div><label class="block text-sm font-medium mb-1">活动内容</label>
          <textarea v-model="form.content" rows="3" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="（一）开幕式&#10;（二）主体活动&#10;（三）闭幕式"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">奖项设置</label>
          <textarea v-model="form.awards" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="一等奖、二等奖、三等奖、参与奖"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">组织分工</label>
          <textarea v-model="form.responsibility" rows="2" class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white" placeholder="策划组、执行组、后勤组"></textarea></div>
        <button @click="generate" :disabled="loading || !form.title" class="w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">{{ loading ? '生成中...' : '生成策划方案' }}</button>
      </div>
    </div>
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
      <div class="min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><pre v-if="result" class="whitespace-pre-wrap text-sm font-serif">{{ result }}</pre><div v-else class="h-full flex items-center justify-center text-gray-400"><div class="text-center"><p class="text-4xl mb-2">🎪</p><p>点击生成策划方案</p></div></div></div>
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
const form = ref({ title: '', theme: '', time: '', location: '', participants: '', content: '', awards: '', responsibility: '' })
const loading = ref(false)
const result = ref('')
const generate = () => {
  if (!form.value.title) { ElMessage.warning('请输入策划标题'); return }
  loading.value = true
  setTimeout(() => {
    const f = form.value
    result.value = `${f.title}

一、活动主题
${f.theme || f.title}

二、活动时间
${f.time || '待定'}

三、活动地点
${f.location || '待定'}

四、参与人员
${f.participants || '全体职工'}

五、活动内容
${f.content || '（一）开幕式\n（二）主体活动\n（三）闭幕式'}

六、奖项设置
${f.awards || '一等奖、二等奖、三等奖、参与奖'}

七、组织分工
${f.responsibility || '策划组、执行组、后勤组、宣传组'}

八、经费预算
${f.awards ? '奖品费用：待定\n场地费用：待定\n其他费用：待定' : ''}

九、安全预案
活动期间需做好安全防护工作，确保活动顺利进行。

十、工作要求
1. 各相关部门要高度重视，精心组织
2. 明确责任分工，确保活动效果
3. 做好宣传报道，及时总结经验`
    loading.value = false
    ElMessage.success('生成成功！')
  }, 500)
}
const copyResult = () => { navigator.clipboard.writeText(result.value); ElMessage.success('已复制') }
const downloadResult = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.value])); a.download = `${form.value.title}.txt`; a.click() }
</script>
