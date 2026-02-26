<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              慰问类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="节日慰问">节日慰问信</option>
              <option value="困难慰问">困难职工慰问信</option>
              <option value="生病慰问">生病住院慰问信</option>
              <option value="去世悼念">去世悼念信</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              慰问对象
            </label>
            <input 
              v-model="form.target" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="被慰问人姓名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              慰问单位
            </label>
            <input 
              v-model="form.sender" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：XX公司工会委员会"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              慰问内容
            </label>
            <textarea 
              v-model="form.content" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入想要表达的内容..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成慰问信' }}
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
              <p class="text-4xl mb-2">💌</p>
              <p>填写完信息后，点击"生成慰问信"按钮</p>
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
  type: '节日慰问',
  target: '',
  sender: '',
  content: ''
})

const loading = ref(false)
const result = ref('')
const useAi = ref(true)

const checkAndGenerate = async () => {
  if (useAi.value) {
    if (!user.value) {
      showLogin()
      return
    }
    
    loading.value = true
    try {
      const res = await request.post('/api/ai/generate', {
        toolType: 'sympathy-letter',
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
  loading.value = true
  
  setTimeout(() => {
    const f = form.value
    const sender = f.sender || 'XX公司工会委员会'
    const date = new Date().toLocaleDateString('zh-CN')
    
    const templates = {
      '节日慰问': `亲爱的${f.target || '职工同志们'}：

${sender}向您致以节日的问候和衷心的祝福！

${f.content || '过去的一年里，您在岗位上辛勤工作，为企业发展做出了积极贡献。在此，向您表示衷心的感谢！'}

新的一年，让我们携手共进，共创美好未来！

祝您节日快乐，阖家幸福！

                        ${sender}
                        ${date}`,
      '困难慰问': `亲爱的${f.target || '同志'}：

得知您目前生活遇到困难，${sender}全体同志深感牵挂。

${f.content || '工会是职工的娘家人，您有困难，我们一定会尽力帮助。'}

请您放心，工会将持续关注您的状况，帮助您渡过难关。

祝您早日走出困境，生活越来越好！

                        ${sender}
                        ${date}`,
      '生病慰问': `亲爱的${f.target || '同志'}：

得知您因病住院，${sender}领导和全体同志都非常关心您。

${f.content || '希望您积极配合治疗，安心养病，保持乐观心态。'}

请您放心治疗，工会会妥善安排您的工作相关事宜。

祝您早日康复！

                        ${sender}
                        ${date}`,
      '去世悼念': `尊敬的${f.target || '同志'}家属：

惊悉${f.target || '您的家人}不幸去世，${sender}全体同志深感痛惜。

${f.content || '我们为失去一位好同志而深感悲痛，并向您及家属致以深切的哀悼。'}

请节哀顺变，保重身体。

                        ${sender}
                        ${date}`
    }
    
    result.value = templates[f.type] || templates['节日慰问']
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
  a.download = `慰问信_${form.value.type}_${form.value.target || '对象'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
