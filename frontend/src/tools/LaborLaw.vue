<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              问题类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="劳动法">劳动法相关</option>
              <option value="工会法">工会法相关</option>
              <option value="劳动合同">劳动合同</option>
              <option value="工资福利">工资福利</option>
              <option value="社会保险">社会保险</option>
              <option value="工作时间">工作时间</option>
              <option value="休息休假">休息休假</option>
              <option value="女职工保护">女职工保护</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              具体问题 <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="form.question" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请详细描述您的劳动法律问题..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              背景情况
            </label>
            <textarea 
              v-model="form.background" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="补充相关背景信息..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading || !form.question"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '获取咨询' }}
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">法律咨询结果</h3>
        
        <div 
          class="min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <pre v-if="result" class="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-serif leading-relaxed">{{ result }}</pre>
          <div v-else class="h-full flex items-center justify-center text-gray-400">
            <div class="text-center">
              <p class="text-4xl mb-2">⚖️</p>
              <p>填写完问题后，点击"获取咨询"按钮</p>
              <p class="text-xs mt-2">仅供参考，不构成法律意见</p>
            </div>
          </div>
        </div>

        <div v-if="result" class="mt-4 flex gap-3">
          <button 
            @click="copyResult" 
            class="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            复制内容
          </button>
          <button 
            @click="downloadResult" 
            class="flex-1 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            下载文件
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const user = inject('user')
const showLogin = inject('showLogin')

const form = ref({
  type: '劳动法',
  question: '',
  background: ''
})

const loading = ref(false)
const result = ref('')
const useAi = ref(true)

const checkAndGenerate = async () => {
  if (!form.value.question) {
    ElMessage.warning('请输入具体问题')
    return
  }

  if (useAi.value) {
    if (!user.value) {
      showLogin()
      return
    }
    
    loading.value = true
    try {
      const res = await request.post('/api/ai/generate', {
        toolType: 'labor-law',
        formData: form.value
      })
      result.value = res.data.content
      ElMessage.success('生成成功！')
    } catch (e) {
      if (e.response?.data?.needLogin) {
        showLogin()
      } else if (e.response?.data?.error?.includes('次数')) {
        ElMessage.error(e.response.data.error)
        inject('showVip')?.()
      } else {
        ElMessage.error(e.message || '生成失败')
        useAi.value = false
        generate()
      }
    } finally {
      loading.value = false
    }
  } else {
    generate()
  }
}

const generate = () => {
  if (!form.value.question) {
    ElMessage.warning('请输入具体问题')
    return
  }

  loading.value = true
  
  setTimeout(() => {
    const f = form.value
    
    result.value = `【劳动法律咨询回复】

一、问题类型
${f.type}

二、具体问题
${f.question}

三、背景情况
${f.background || '无'}

四、法律分析

根据《中华人民共和国劳动法》、《中华人民共和国劳动合同法》等相关规定：

1. 【法律规定】
   相关法律条文说明...

2. 【法律分析】
   针对您的问题，根据实际情况分析如下...

3. 【建议措施】
   - 建议与用人单位协商解决
   - 如协商不成，可向劳动监察部门投诉
   - 也可以申请劳动仲裁

五、风险提示

1. 注意收集和保存相关证据
2. 依法维权，注意时效
3. 建议咨询专业律师获取更准确的法律意见

六、相关法条

《中华人民共和国劳动法》相关规定...
《中华人民共和国劳动合同法》相关规定...

---
【免责声明】
本回复仅供参考，不构成正式法律意见。具体法律问题请咨询专业律师或当地劳动部门。

【建议】
如需进一步帮助，建议：
1. 拨打12333劳动和社会保障热线
2. 咨询当地工会组织
3. 联系法律援助中心
`
    loading.value = false
    ElMessage.success('生成成功！')
  }, 500)
}

const copyResult = () => {
  navigator.clipboard.writeText(result.value)
  ElMessage.success('已复制到剪贴板')
}

const downloadResult = () => {
  const blob = new Blob([result.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `劳动法律咨询_${new Date().toISOString().slice(0,10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
