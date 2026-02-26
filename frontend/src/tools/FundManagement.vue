<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              文档类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="经费预算">经费预算报告</option>
              <option value="报销制度">报销制度</option>
              <option value="资产管理">资产管理制度</option>
              <option value="采购办法">采购管理办法</option>
              <option value="审计报告">审计报告</option>
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
              年度/金额
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
              详细内容
            </label>
            <textarea 
              v-model="form.content" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入具体内容..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成文档' }}
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
              <p class="text-4xl mb-2">💰</p>
              <p>填写完信息后，点击"生成文档"按钮</p>
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
  type: '经费预算',
  organization: '',
  year: '',
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
        toolType: 'fund-management',
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
    const date = new Date().toLocaleDateString('zh-CN')
    const org = f.organization || 'XX公司工会委员会'
    const year = f.year || '2024年度'
    
    const templates = {
      '经费预算': `【${org}${year}经费预算报告】

一、收入预算

| 项目 | 金额（元） | 占比 |
|-----|-----------|------|
| 会费收入 | 待统计 | % |
| 拨缴经费收入 | 待统计 | % |
| 上级补助收入 | 待统计 | % |
| 其他收入 | 待统计 | % |
| 合计 | 待核算 | 100% |

二、支出预算

| 项目 | 金额（元） | 占比 |
|-----|-----------|------|
| 职工活动支出 | 待核算 | % |
| 维权支出 | 待核算 | % |
| 业务支出 | 待核算 | % |
| 资本性支出 | 待核算 | % |
| 其他支出 | 待核算 | % |
| 合计 | 待核算 | 100% |

三、预算说明
${f.content || '根据工作需要和经费收入情况编制...'}

四、审批意见
经审委员会审核通过。

                  审批人：____________
                  ${date}
`,
      '报销制度': `【${org}经费报销制度】

一、总则
为规范经费报销程序，加强财务管理，根据有关规定，结合本单位实际，制定本制度。

二、报销原则
（一）合法性原则
（二）真实性原则
（三）规范性原则
（四）勤俭节约原则

三、报销流程
1. 经办人填写报销单
2. 部门负责人审核
3. 财务人员复核
4. 领导审批
5. 财务报销

四、报销标准
${f.content || '具体标准根据相关规定执行'}

五、报销时限
费用发生后30日内完成报销。

六、本制度自${date}起施行。
`,
      '资产管理': `【${org}资产管理制度】

一、总则
为加强工会资产管理，确保资产安全完整，根据有关规定，制定本制度。

二、资产范围
（一）固定资产
（二）流动资产
（三）无形资产

三、管理职责
（一）工会办公室负责日常管理
（二）财务部门负责价值管理
（三）使用部门负责保管维护

四、资产购置
${f.content || '按照采购管理办法执行'}

五、资产处置
按规定程序报批后处置。

六、资产清查
定期进行资产清查，确保账实相符。

七、本制度自${date}起施行。
`
    }
    
    result.value = templates[f.type] || templates['经费预算']
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
  a.download = `工会经费_${form.value.type}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
