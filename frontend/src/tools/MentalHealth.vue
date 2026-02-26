<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              内容类型
            </label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="心理健康知识">心理健康知识普及</option>
              <option value="心理疏导方案">心理疏导活动方案</option>
              <option value="压力管理">压力管理技巧</option>
              <option value="情绪调节">情绪调节方法</option>
              <option value="职场心理">职场心理调适</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              目标受众
            </label>
            <input 
              v-model="form.audience" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：全体职工、新入职员工"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              具体需求
            </label>
            <textarea 
              v-model="form.needs" 
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请描述具体需求..."
            ></textarea>
          </div>

          <button 
            @click="checkAndGenerate" 
            :disabled="loading"
            class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? '生成中...' : '生成内容' }}
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
              <p class="text-4xl mb-2">🧠</p>
              <p>填写完信息后，点击"生成内容"按钮</p>
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
  type: '心理健康知识',
  audience: '全体职工',
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
        toolType: 'mental-health',
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
    
    const templates = {
      '心理健康知识': `【${f.audience}心理健康知识普及】

一、什么是心理健康
心理健康是指个体能够正确认识自己、正确认识环境和正确认识社会，具有良好的心理素质和社会适应能力。

二、常见心理问题识别
1. 焦虑情绪：过度担心、紧张、心慌
2. 抑郁情绪：情绪低落、兴趣减退、失眠
3. 压力过大：工作压力、生活压力带来的身心反应
4. 人际关系问题：沟通障碍、社交恐惧

三、心理健康标准
1. 情绪稳定，能应对正常压力
2. 自我认知清晰，有自知之明
3. 人际关系和谐
4. 热爱生活，有幸福感
5. 睡眠质量良好

四、保持心理健康的方法
1. 规律作息，充足睡眠
2. 适度运动，身心健康
3. 均衡饮食，营养充足
4. 培养兴趣爱好，丰富生活
5. 建立良好人际关系
6. 学会压力管理
7. 必要时寻求专业帮助

五、心理求助渠道
- 工会心理援助热线
- 专业心理咨询机构
- 员工帮助计划（EAP）
`,
      '心理疏导方案': `【${f.audience}心理疏导活动方案】

一、活动背景
${f.needs || '为帮助职工缓解心理压力，提升心理健康水平'}

二、活动目标
1. 帮助职工了解心理健康知识
2. 缓解职工工作和生活压力
3. 提升职工心理抗压能力
4. 建立和谐人际关系

三、活动安排

| 时间 | 内容 | 形式 | 负责人 |
|-----|------|------|--------|
| 第1周 | 心理健康讲座 | 线下/线上 | 工会 |
| 第2周 | 团体心理辅导 | 小组活动 | 心理咨询师 |
| 第3周 | 个别心理咨询 | 一对一 | 专业咨询师 |
| 第4周 | 成果总结 | 分享会 | 工会 |

四、活动内容
1. 心理健康知识讲座
2. 压力测试与评估
3. 放松技巧训练
4. 情绪管理培训
5. 冥想与正念练习

五、预期效果
1. 参与职工压力水平明显降低
2. 掌握基本心理调适方法
3. 建立心理支持网络
`,
      '压力管理': `【职场压力管理指南】

一、压力识别
${f.needs || '识别压力信号：失眠、焦虑、情绪波动'}

二、压力管理技巧

1. 时间管理
   - 制定合理计划
   - 区分轻重缓急
   - 学会委托他人

2. 放松技巧
   - 深呼吸练习
   - 渐进性肌肉放松
   - 正念冥想

3. 思维转变
   - 接受无法改变的事
   - 改变对问题的看法
   - 建立积极思维

4. 生活方式
   - 规律运动
   - 充足睡眠
   - 健康饮食

三、自我检测
定期评估压力水平，必要时寻求专业帮助。
`,
      '情绪调节': `【情绪调节方法指南】

一、认识情绪
情绪是对客观事物的主观反应，包括喜、怒、哀、惧等基本情绪。

二、情绪调节技巧

1. 觉察情绪
   - 留意身体反应
   - 识别情绪变化
   - 接纳情绪存在

2. 表达情绪
   - 倾诉与分享
   - 写情绪日记
   - 艺术表达

3. 调节方法
   - 暂停与冷静
   - 换位思考
   - 问题解决
   - 寻求支持

三、积极情绪培养
1. 感恩练习
2. 记录美好
3. 助人为乐
4. 培养兴趣
`,
      '职场心理': `【职场心理调适指南】

一、职场常见心理问题
1. 职业倦怠
2. 工作压力
3. 人际关系困扰
4. 职业发展困惑

二、职场心理调适方法

1. 职业倦怠应对
   - 重新审视工作意义
   - 适当休息调整
   - 寻求新的挑战

2. 工作压力缓解
   - 制定可行目标
   - 合理安排时间
   - 学会放松休息

3. 人际关系处理
   - 有效沟通
   - 尊重差异
   - 建立信任

4. 职业发展建议
   - 明确职业目标
   - 持续学习提升
   - 拓展职业视野

三、建议
保持工作与生活平衡，关注心理健康。
`
    }
    
    result.value = templates[f.type] || templates['心理健康知识']
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
  a.download = `职工心理健康_${form.value.type}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
