<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              报告类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="预算报告">经费预算报告</option>
              <option value="决算报告">经费决算报告</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              工会名称
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
              年度
            </label>
            <input 
              v-model="form.year" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：2024年度"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              收入情况
            </label>
            <textarea 
              v-model="form.income" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="收入构成..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              支出情况
            </label>
            <textarea 
              v-model="form.expense" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="支出构成..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成报告' }}
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
              <p class="text-4xl mb-2">📊</p>
              <p>填写完信息后，点击"生成报告"按钮</p>
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
  type: '预算报告',
  organization: '',
  year: '',
  income: '',
  expense: ''
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
        toolType: 'budget-report',
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
    const org = f.organization || 'XX公司工会委员会'
    const year = f.year || new Date().getFullYear() + '年度'
    const date = new Date().toLocaleDateString('zh-CN')
    
    result.value = `【${org}${year}${f.type}】

一、基本情况
${org}现有会员${'XXX'}人，${f.type === '预算报告' ? '按照上级工会要求，编制本年度经费预算。' : '本年度经费使用情况如下。'}

二、${f.type === '预算报告' ? '收入预算' : '收入决算'}

| 项目 | 金额（元） | 占比 | 备注 |
|-----|-----------|------|------|
| 会费收入 | | | 按工资0.5%收取 |
| 拨缴经费收入 | | | 工资总额2% |
| 上级补助收入 | | | |
| 行政补助收入 | | | |
| 其他收入 | | | |
| 合计 | | 100% | |

${f.income || '（根据实际情况填写）'}

三、${f.type === '预算报告' ? '支出预算' : '支出决算'}

| 项目 | 金额（元） | 占比 | 备注 |
|-----|-----------|------|------|
| 职工活动支出 | | | 文体活动、教育培训 |
| 维权支出 | | | 劳动保护、法律援助 |
| 业务支出 | | | 会议、培训、办公 |
| 资本性支出 | | | 固定资产购置 |
| 其他支出 | | | |
| 上解经费 | | | 按规定比例上解 |
| 合计 | | 100% | |

${f.expense || '（根据实际情况填写）'}

四、${f.type === '预算报告' ? '预算说明' : '决算说明'}

${f.type === '预算报告' ? `（一）坚持量入为出、收支平衡原则
（二）统筹兼顾，保证重点支出
（三）厉行节约，反对浪费
（四）严格按照规定使用经费` : `（一）经费使用符合相关规定
（二）支出结构合理
（三）有效保障了工会工作开展`}

五、${f.type === '预算报告' ? '保障措施' : '审计情况'}

${f.type === '预算报告' ? `（一）加强预算管理
（二）严格审批程序
（三）接受监督检查` : `（一）经费收支经审计合规
（二）定期向会员代表大会报告`}

---
                    ${org}
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
  a.download = `工会经费_${form.value.type}_${form.value.year || '年度'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
