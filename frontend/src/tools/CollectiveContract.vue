<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
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
              合同类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="集体合同">集体合同</option>
              <option value="工资专项">工资专项集体合同</option>
              <option value="女职工保护">女职工特殊保护专项集体合同</option>
              <option value="劳动安全">劳动安全卫生专项集体合同</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              合同期限
            </label>
            <input 
              v-model="form.period" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：一年"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              主要内容
            </label>
            <textarea 
              v-model="form.content" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入合同的主要内容..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成合同' }}
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
              <p class="text-4xl mb-2">📜</p>
              <p>填写完信息后，点击"生成合同"按钮</p>
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
  company: '',
  type: '集体合同',
  period: '一年',
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
        toolType: 'collective-contract',
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
    const year = new Date().getFullYear()
    
    result.value = `【${company}${f.type}】

合同编号：${year}－001

甲方（用人单位）：${company}
乙方（职工方）：${company}工会

根据《中华人民共和国劳动法》、《中华人民共和国劳动合同法》、《中华人民共和国工会法》等法律法规，甲乙双方经平等协商，签订本合同。

第一章 总则

第一条 目的
为建立和谐稳定的劳动关系，维护职工合法权益，促进企业健康发展。

第二条 原则
（一）合法合规原则
（二）平等协商原则
（三）利益共享原则

第二章 ${f.type === '集体合同' ? '主要内容' : f.type === '工资专项' ? '工资分配' : f.type === '女职工保护' ? '女职工保护' : '劳动安全卫生'}

${f.content || `第三条 ${f.type === '集体合同' ? '工作时间和休息休假' : f.type === '工资专项' ? '工资标准' : f.type === '女职工保护' ? '工作时间' : '安全生产'}
（一）${f.type === '集体合同' ? '甲方应保障乙方职工依法享有休息休假权利' : f.type === '工资专项' ? '甲方应按月足额支付乙方工资' : f.type === '女职工保护' ? '甲方应保障女职工合法权益' : '甲方应加强安全生产管理'}
（二）${f.type === '集体合同' ? '具体休假制度按国家规定执行' : f.type === '工资专项' ? '工资不得低于当地最低工资标准' : f.type === '女职工保护' ? '孕期、产期、哺乳期' : '劳动防护用品配备'}`}

第三章 劳动报酬

第四条 工资支付
甲方应按月足额支付乙方工资，不得克扣或无故拖欠。

第四章 保险福利

第五条 社会保险
甲方应依法为乙方职工缴纳社会保险费。

第五章 合同的履行、变更、解除和终止

第六条 履行
本合同自${date}起生效，有效期为${f.period}。

第七条 变更
需要变更本合同内容时，须经双方协商一致。

第八条 解除
有下列情形之一的，可以解除本合同：
（一）双方协商一致的
（二）因不可抗力致使合同无法履行的

第九条 终止
本合同期满或依法解除后终止。

第六章 争议处理

第十条 争议解决
因履行本合同发生争议，甲乙双方应协商解决；协商不成的，可以依法申请仲裁或提起诉讼。

第七章 附则

第十一条 本合同一式四份，甲乙双方各执一份，报送人力资源和社会保障部门一份，报上级工会一份。

甲方（盖章）：________________   乙方（盖章）：________________
法定代表人：________________     工会主席：________________
${date}                    ${date}
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
  a.download = `${form.value.company || '企业'}_${form.value.type}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
