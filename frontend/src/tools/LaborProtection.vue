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
              <option value="发放制度">劳保用品发放管理制度</option>
              <option value="发放标准">劳保用品发放标准</option>
              <option value="领用表">劳保用品领用登记表</option>
              <option value="库存表">劳保用品库存台账</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              工会/单位名称
            </label>
            <input 
              v-model="form.organization" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：XX公司工会"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              岗位类型
            </label>
            <input 
              v-model="form.positions" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：车间工人、办公室人员"
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
              placeholder="请输入详细内容..."
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
              <p class="text-4xl mb-2">🦺</p>
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
  type: '发放制度',
  organization: '',
  positions: '',
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
        toolType: 'labor-protection',
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
    const org = f.organization || 'XX公司'
    const date = new Date().toLocaleDateString('zh-CN')
    
    const templates = {
      '发放制度': `【${org}劳保用品发放管理制度】

一、总则
为保障职工劳动安全，规范劳保用品发放，根据国家有关规定，结合本单位实际，制定本制度。

二、适用范围
本制度适用于${org}全体职工。

三、管理职责
（一）工会负责劳保用品的监督管理工作
（二）行政负责采购和发放
（三）各部门负责本部门职工的领用管理

四、发放原则
（一）按需配发原则
（二）定期更换原则
（三）个人保管原则

五、劳保用品配发标准

| 工种 | 防护用品 | 更换周期 |
|-----|---------|---------|
| 车间操作工 | 安全帽、工作服、手套、防护鞋 | 按需/定期 |
| 办公室人员 | | |
| 特殊工种 | 根据岗位需要配备 | 按需 |

${f.content || ''}

六、领用流程
1. 职工填写领用申请
2. 部门负责人审核
3. 劳保管理员发放
4. 领取人签字确认

七、注意事项
1. 正确使用劳保用品
2. 妥善保管，不得私自转让
3. 损坏或遗失及时报告

八、本制度自${date}起施行。
`,
      '发放标准': `【${org}劳保用品发放标准】

| 序号 | 用品名称 | 规格 | 单位 | 配发周期 | 适用岗位 |
|-----|---------|------|------|---------|---------|
| 1 | 安全帽 | | 顶 | 2年 | 高处作业 |
| 2 | 工作服 | | 套 | 1年 | 在岗职工 |
| 3 | 防护手套 | | 副 | 1月 | 接触有害因素 |
| 4 | 防护鞋 | | 双 | 1年 | 特殊工种 |
| 5 | 耳塞/耳罩 | | 副 | 半年 | 噪声岗位 |
| 6 | 防护眼镜 | | 副 | 1年 | 焊接、粉尘 |
| 7 | 口罩 | | 只 | 1月 | 粉尘、有毒 |
| 8 | 反光背心 | | 件 | 2年 | 夜间作业 |

${f.content || ''}

注：特殊岗位可根据实际情况调整。
`,
      '领用表': `【劳保用品领用登记表】

领用日期：_____________

| 序号 | 姓名 | 部门 | 用品名称 | 数量 | 签字 |
|-----|------|------|---------|------|------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

发放人：_____________    领取人：_____________
`,
      '库存表': `【劳保用品库存台账】

记录日期：${date}

| 序号 | 用品名称 | 规格 | 单位 | 入库数量 | 出库数量 | 库存数量 | 日期 |
|-----|---------|------|------|---------|---------|---------|------|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |

保管人：_____________    审核人：_____________
`
    }
    
    result.value = templates[f.type] || templates['发放制度']
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
  a.download = `劳保用品_${form.value.type}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
