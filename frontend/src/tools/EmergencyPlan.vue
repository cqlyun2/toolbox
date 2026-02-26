<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              预案类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="生产安全">生产安全事故应急预案</option>
              <option value="消防安全">火灾事故应急预案</option>
              <option value="突发公共卫生">突发公共卫生事件应急预案</option>
              <option value="自然灾害">自然灾害应急预案</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              适用范围
            </label>
            <input 
              v-model="form.scope" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：公司全体职工"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              组织机构
            </label>
            <textarea 
              v-model="form.organization" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="应急组织机构设置..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              应急措施
            </label>
            <textarea 
              v-model="form.measures" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="应急处置措施..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成预案' }}
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
              <p class="text-4xl mb-2">🚨</p>
              <p>填写完信息后，点击"生成预案"按钮</p>
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
  type: '生产安全',
  scope: '',
  organization: '',
  measures: ''
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
        toolType: 'emergency-plan',
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
    
    result.value = `【${f.type}应急预案】

一、总则
（一）编制目的
为有效预防和及时处置${f.type}事故，减少人员伤亡和财产损失，维护职工生命财产安全。
（二）适用范围
本预案适用于${f.scope || '公司范围内'}发生的${f.type}事故。
（三）工作原则
1. 以人为本，安全第一
2. 预防为主，平战结合
3. 统一指挥，分级负责

二、组织机构

${f.organization || `（一）应急领导小组
组长：分管领导
副组长：安全总监
成员：各部门负责人

（二）应急指挥中心
设在安全管理部，负责日常应急管理工作

（三）应急救援队伍
包括抢险救援组、医疗救护组、后勤保障组等`}

三、预防与预警

（一）预防措施
1. 定期开展安全检查
2. 及时排查隐患
3. 加强安全培训

（二）预警级别
按照事故严重程度分为特别重大、重大、较大、一般四个等级。

四、应急响应

（一）响应程序
1. 事故发生后，立即启动应急预案
2. 第一时间组织救援
3. 及时上报有关部门

${f.measures || `（二）应急处置措施
1. 现场警戒，保护现场
2. 组织人员疏散
3. 切断危险源
4. 实施救援`}

五、后期处置

（一）善后处理
1. 做好伤亡人员抚恤
2. 做好财产损失补偿
3. 做好家属安抚

（二）事故调查
配合上级部门做好事故调查，查明原因，总结教训。

六、应急保障

（一）物资保障
储备必要的应急物资和装备

（二）经费保障
应急经费纳入年度预算

七、附则

本预案自${date}起施行，由安全管理部负责解释。

                  XX公司工会委员会
                  XX公司安全管理部
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
  a.download = `应急预案_${form.value.type}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
