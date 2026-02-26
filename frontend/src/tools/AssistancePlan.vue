<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              帮扶对象
            </label>
            <input 
              v-model="form.target" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：困难职工张三"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              困难类型
            </label>
            <select 
              v-model="form.difficultyType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="生活困难">生活困难</option>
              <option value="家庭困难">家庭困难</option>
              <option value="医疗困难">医疗困难</option>
              <option value="子女教育困难">子女教育困难</option>
              <option value="突发困难">突发困难</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              困难情况说明
            </label>
            <textarea 
              v-model="form.situation" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="详细描述困难情况..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              帮扶需求
            </label>
            <input 
              v-model="form.needs" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：资金帮扶、就业援助、心理疏导"
            />
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
  target: '',
  difficultyType: '生活困难',
  situation: '',
  needs: ''
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
        toolType: 'assistance-plan',
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
    
    result.value = `【困难职工帮扶方案】

一、帮扶对象基本信息
姓名：${f.target || '待填写'}
困难类型：${f.difficultyType}

二、困难情况描述
${f.situation || '详细描述困难情况...'}

三、帮扶措施

（一）生活帮扶
1. 节日慰问：元旦、春节、五一、国庆等重大节日开展慰问活动
2. 生活补贴：定期发放生活补贴
3. 物资帮扶：提供必要的生活物资

（二）医疗帮扶
1. 医疗救助：协助申请医疗救助金
2. 健康体检：组织免费健康体检
3. 大病帮扶：针对重大疾病提供专项帮扶

（三）就业帮扶
1. 技能培训：提供免费职业技能培训
2. 岗位推荐：优先推荐就业岗位
3. 创业支持：提供创业指导和小额贷款协助

（四）教育帮扶
1. 金秋助学：子女上学提供助学资金
2. 课外辅导：组织志愿者进行学业辅导

（五）心理帮扶
1. 心理疏导：定期开展心理辅导
2. 关爱谈话：建立联系人制度，定期关心问候

四、帮扶安排

| 时间节点 | 帮扶内容 | 责任人 |
|---------|---------|--------|
| 第1周 | 入户走访，了解情况 | 帮扶责任人 |
| 第1月 | 制定个性化帮扶方案 | 帮扶小组 |
| 季度 | 跟踪回访，评估效果 | 工会干部 |
| 年度 | 总结评估，持续改进 | 工会委员会 |

五、预期目标
1. 改善困难职工生活水平
2. 帮助解决实际困难
3. 增强职工信心和归属感

六、保障措施
1. 建立帮扶档案
2. 落实帮扶资金
3. 加强监督检查

---
帮扶单位：XX工会
制定日期：${date}
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
  a.download = `困难职工帮扶方案_${form.value.target || '帮扶对象'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
