<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              活动类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="户外拓展">户外拓展训练</option>
              <option value="文体活动">文体娱乐活动</option>
              <option value="主题团建">主题团建活动</option>
              <option value="志愿服务">志愿服务活动</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              参与人数
            </label>
            <input 
              v-model="form.participants" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：50人"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              活动主题
            </label>
            <input 
              v-model="form.theme" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：凝聚力量 共创未来"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              时间安排
            </label>
            <input 
              v-model="form.time" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：2024年5月"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              预算范围
            </label>
            <input 
              v-model="form.budget" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：10000元"
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
              <p class="text-4xl mb-2">🎳</p>
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
  type: '户外拓展',
  participants: '',
  theme: '',
  time: '',
  budget: ''
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
        toolType: 'team-building',
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
    
    result.value = `【团建活动方案】

一、活动主题
${f.theme || '凝聚力量 携手共进'}

二、活动目的
1. 增强团队凝聚力
2. 促进员工沟通交流
3. 缓解工作压力
4. 提升团队协作能力

三、活动概况
| 项目 | 内容 |
|-----|------|
| 活动类型 | ${f.type} |
| 参与人数 | ${f.participants || '待定'} |
| 活动时间 | ${f.time || '待定'} |
| 预算范围 | ${f.budget || '待定'} |

四、活动安排

| 时间 | 活动内容 | 备注 |
|-----|---------|------|
| 8:30 | 集合出发 | 统一乘车 |
| 9:30 | 到达场地 | 破冰分组 |
| 10:00 | 团建项目1 | 团队协作 |
| 11:30 | 团建项目2 | 竞技PK |
| 12:00 | 午餐休息 | 自由活动 |
| 13:30 | 团建项目3 | 创新挑战 |
| 15:30 | 总结分享 | 心得交流 |
| 16:00 | 返程 | 返程 |

五、团建项目建议

（一）${f.type === '户外拓展' ? `1. 高空断桥
2. 信任背摔
3. 毕业墙
4. 团队七巧板` : f.type === '文体活动' ? `1. 篮球比赛
2. 拔河比赛
3. 趣味运动会
4. K歌比赛` : f.type === '主题团建' ? `1. 密室逃脱
2. 城市寻宝
3. 主题晚宴
4. 创意工作坊` : `1. 社区服务
2. 环保行动
3. 爱心捐赠
4. 义工活动`}

六、费用预算

| 项目 | 金额（元） | 备注 |
|-----|-----------|------|
| 场地费用 | | |
| 交通费用 | | |
| 餐饮费用 | | |
| 活动器材 | | |
| 奖品费用 | | |
| 其他费用 | | |
| 合计 | | |

七、组织分工

| 职责 | 负责人 |
|-----|--------|
| 总协调 | 工会 |
| 安全保障 | 行政部 |
| 后勤保障 | 后勤部 |
| 活动执行 | 团委 |

八、安全预案
1. 购买意外保险
2. 准备急救药品
3. 安排应急车辆
4. 指定安全员

九、注意事项
1. 穿着舒适运动装
2. 听从指挥，注意安全
3. 保护环境，不乱扔垃圾
4. 如有身体不适及时报告

十、本方案报工会审批后执行。

                  XX工会委员会
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
  a.download = `团建活动方案_${form.value.type}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
