<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              通知标题 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.title" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：关于举办五一劳动节活动的通知"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              发布单位
            </label>
            <input 
              v-model="form.organization" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：XX公司工会委员会"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              活动时间
            </label>
            <input 
              v-model="form.time" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：2024年5月1日上午9:00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              活动地点
            </label>
            <input 
              v-model="form.location" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：公司职工活动中心"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              通知内容
            </label>
            <textarea 
              v-model="form.content" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入通知的主要内容..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              参与对象
            </label>
            <input 
              v-model="form.participants" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：全体职工"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              报名截止时间
            </label>
            <input 
              v-model="form.deadline" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：2024年4月25日"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              联系人
            </label>
            <input 
              v-model="form.contact" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：张老师"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              联系电话
            </label>
            <input 
              v-model="form.phone" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：12345678901"
            />
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading || !form.title"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成通知' }}
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">生成结果</h3>
        
        <div 
          class="min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <pre v-if="result" class="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-serif leading-relaxed">{{ result }}</pre>
          <div v-else class="h-full flex items-center justify-center text-gray-400">
            <div class="text-center">
              <p class="text-4xl mb-2">📝</p>
              <p>填写完信息后，点击"生成通知"按钮</p>
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
  title: '',
  organization: '',
  time: '',
  location: '',
  content: '',
  participants: '',
  deadline: '',
  contact: '',
  phone: ''
})

const loading = ref(false)
const result = ref('')
const useAi = ref(true)

const checkAndGenerate = async () => {
  if (!form.value.title) {
    ElMessage.warning('请输入通知标题')
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
        toolType: 'notice-generator',
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
  if (!form.value.title) {
    ElMessage.warning('请输入通知标题')
    return
  }

  loading.value = true
  
  setTimeout(() => {
    const f = form.value
    const date = new Date().toLocaleDateString('zh-CN')
    
    result.value = `${f.title}

${f.organization || 'XX公司工会委员会'}：

为${f.content || '丰富职工文化生活，活跃工作气氛'},现将有关事项通知如下：

一、活动时间
${f.time || '另行通知'}

二、活动地点
${f.location || '另行通知'}

三、参与对象
${f.participants || '全体职工'}

${f.content ? `四、主要内容\n${f.content}` : ''}

${f.deadline ? `五、报名截止时间\n${f.deadline}` : ''}

${f.contact || f.phone ? `六、联系方式\n联系人：${f.contact || '待定'}\n联系电话：${f.phone || '待定'}` : ''}

${f.organization || 'XX公司工会委员会'}
${date}
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
  a.download = `${form.value.title || '通知'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
