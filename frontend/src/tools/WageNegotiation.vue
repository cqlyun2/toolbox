<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              协商类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="工资集体协商">工资集体协商</option>
              <option value="专项协议">专项工资协议</option>
              <option value="女职工保护">女职工特殊保护协议</option>
              <option value="劳动安全">劳动安全卫生协议</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              企业名称
            </label>
            <input 
              v-model="form.company" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：XX公司"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              协商重点
            </label>
            <textarea 
              v-model="form.focus" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请说明协商的主要内容和目标..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              职工诉求
            </label>
            <textarea 
              v-model="form.demands" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请说明职工的主要诉求..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成方案' }}
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
              <p class="text-4xl mb-2">🤝</p>
              <p>填写完信息后，点击"生成方案"按钮</p>
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
  type: '工资集体协商',
  company: '',
  focus: '',
  demands: ''
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
        toolType: 'wage-negotiation',
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
    const company = f.company || 'XX公司'
    const date = new Date().toLocaleDateString('zh-CN')
    
    result.value = `【${company}${f.type}方案】

一、协商背景
为建立和谐稳定的劳动关系，保障职工合法权益，促进企业健康发展，根据《劳动法》、《劳动合同法》、《工资集体协商试行办法》等法律法规，开展${f.type}。

二、协商主体
（一）企业方：${company}
（二）职工方：${company}工会

三、协商代表
（一）企业代表：由企业法定代表人或其委托的代表担任
（二）职工代表：由工会组织职工民主推选产生

四、协商内容

（一）${f.type === '工资集体协商' ? `工资分配制度
1. 工资分配原则
2. 工资构成（基本工资、绩效工资、加班工资等）
3. 工资支付时间与方式

工资调整
1. 工资调整幅度
2. 调整依据（经济效益、物价指数等）
3. 最低工资保障

奖金福利
1. 年终奖发放
2. 福利待遇标准
3. 加班工资计算标准` : f.type === '女职工保护' ? `女职工特殊保护
1. 工作时间保护
2. 产假待遇
3. 哺乳时间安排
4. 职业危害防护
5. 公平就业保障` : f.type === '劳动安全' ? `劳动安全卫生
1. 安全生产责任
2. 劳动防护用品
3. 职业病防治
4. 应急救援措施
5. 安全培训教育` : '专项协议内容'}

五、协商重点
${f.focus || `1. 工资增长机制
2. 工资分配方案
3. 福利待遇标准
4. 休息休假安排`}

六、职工诉求
${f.demands || '根据职工代表大会提案整理'}

七、协商程序

| 阶段 | 时间 | 内容 |
|-----|------|------|
| 准备阶段 | 30日前 | 收集意见、准备材料 |
|要约阶段 | 15日前 | 发出协商要约 |
| 协商阶段 | 30日内 | 正式协商 |
| 审议阶段 | 7日内 | 职代会审议 |
| 备案阶段 | 15日内 | 报送人社部门备案 |

八、预期目标
1. 建立正常的工资增长机制
2. 保障职工合法权益
3. 促进企业和谐发展

九、协议期限
本协议有效期为${new Date().getFullYear()}年${new Date().getMonth() + 1}月1日至${new Date().getFullYear() + 1}年${new Date().getMonth()}月31日。

十、生效条件
本协议经职工代表大会通过并报人力资源和社会保障部门审查同意后生效。

---
                  ${company}工会
                  ${company}
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
  a.download = `工资集体协商_${form.value.company || '企业'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
