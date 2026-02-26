<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              办理类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="入会申请书">工会会员入会申请书</option>
              <option value="会员登记表">工会会员登记表</option>
              <option value="会员证">工会会员证</option>
              <option value="退会申请">会员退会申请</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              姓名
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入姓名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              单位
            </label>
            <input 
              v-model="form.department" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：XX公司XX部门"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              个人信息
            </label>
            <textarea 
              v-model="form.info" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="补充个人信息..."
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
              <p class="text-4xl mb-2">👥</p>
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
  type: '入会申请书',
  name: '',
  department: '',
  info: ''
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
        toolType: 'membership',
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
    
    const templates = {
      '入会申请书': `【工会入会申请书】

${f.department || 'XX公司'}工会：

本人${f.name || 'XXX'}，${f.info || '现自愿申请加入中国工会，成为一名工会会员。'}

本人承诺：
一、遵守《中国工会章程》
二、履行会员义务
三、积极参加工会活动
四、维护工会团结
五、按规定缴纳会费

请批准！

                        申请人：${f.name || 'XXX'}
                        ${date}`,
      '会员登记表': `【工会会员登记表】

| 项目 | 内容 |
|-----|------|
| 姓名 | ${f.name || ''} |
| 性别 | |
| 出生年月 | |
| 民族 | |
| 学历 | |
| 政治面貌 | |
| 部门 | ${f.department || ''} |
| 职务 | |
| 联系电话 | |
| 入会日期 | ${date} |
| 会员编号 | |

| 简历 | |
|-----|------|
| | |

| 家庭主要成员 | |
|-------------|------|
| | |

                    工会盖章
                    ${date}`,
      '会员证': `【工会会员证】

会员证号：_____________

| 姓名 | ${f.name || ''} |
|-----|------|
| 性别 | |
| 单位 | ${f.department || ''} |
| 职务 | |
| 入会日期 | ${date} |

| 缴费记录 | |
|---------|------|
| 年度 | 金额 |
| | |

| 转会记录 | |
|---------|------|
| 日期 | 转入/转出 |
| | |

                    XX公司工会
                    （盖章）
`,
      '退会申请': `【会员退会申请】

${f.department || 'XX公司'}工会：

本人${f.name || 'XXX'}，因${f.info || '个人原因'}，现申请退出中国工会。

本人承诺：
一、已结清会费
二、无任何经济纠纷
三、配合完成退会手续

请批准！

                        申请人：${f.name || 'XXX'}
                        ${date}`
    }
    
    result.value = templates[f.type] || templates['入会申请书']
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
  a.download = `会员_${form.value.type}_${form.value.name || '会员'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
