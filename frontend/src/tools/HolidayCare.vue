<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-4">填写信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              节日类型
            </label>
            <select 
              v-model="form.holiday"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="春节">春节</option>
              <option value="五一">五一劳动节</option>
              <option value="端午">端午节</option>
              <option value="中秋">中秋节</option>
              <option value="国庆">国庆节</option>
              <option value="重阳">重阳节</option>
              <option value="三八">三八妇女节</option>
              <option value="六一">六一儿童节</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              慰问对象
            </label>
            <input 
              v-model="form.target" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：全体职工、困难职工"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              活动时间
            </label>
            <input 
              v-model="form.time" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：2024年2月"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              预算标准
            </label>
            <input 
              v-model="form.budget" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：人均200元"
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
              <p class="text-4xl mb-2">🎁</p>
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
  holiday: '春节',
  target: '全体职工',
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
        toolType: 'holiday-care',
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
    
    const holidayContent = {
      '春节': `（一）节日问候
向全体职工致以节日的问候和祝福。

（二）节日福利
1. 发放节日礼品或购物卡
2. 举办新春团拜会
3. 组织年夜饭活动

（三）重点慰问
1. 走访慰问困难职工
2. 慰问坚守岗位职工
3. 慰问退休职工

（四）文化活动
1. 举办新春联欢会
2. 开展送春联活动
3. 组织游园活动`,
      '五一': `（一）表彰先进
1. 表彰劳动模范
2. 表彰优秀职工

（二）文体活动
1. 举办趣味运动会
2. 组织技能比赛

（三）慰问活动
1. 慰问一线职工
2. 发放节日慰问品`,
      '端午': `（一）传统活动
1. 组织包粽子活动
2. 举办端午文化讲座

（二）节日福利
1. 发放端午礼品
2. 赠送粽子礼盒`,
      '中秋': `（一）团圆活动
1. 举办中秋晚会
2. 组织赏月活动

（二）节日福利
1. 发放中秋礼品
2. 赠送月饼礼盒

（三）关爱活动
1. 慰问异地职工
2. 慰问职工家属`,
      '国庆': `（一）庆祝活动
1. 举办国庆联欢会
2. 组织观看爱国影片

（二）爱国主义教育
1. 参观红色教育基地
2. 开展主题党日活动

（三）节日福利
1. 发放节日慰问品`,
      '重阳': `（一）敬老活动
1. 召开退休职工座谈会
2. 走访慰问退休职工

（二）健康关爱
1. 组织健康体检
2. 开展健康讲座`,
      '三八': `（一）表彰活动
1. 表彰优秀女职工
2. 表彰巾帼建功标兵

（二）关爱活动
1. 发放女性用品
2. 组织健康体检

（三）文体活动
1. 举办女性主题活动
2. 组织美容养生讲座`,
      '六一': `（一）亲子活动
1. 举办亲子运动会
2. 组织儿童节活动

（二）关爱职工子女
1. 发放儿童节礼物
2. 开展金秋助学摸底`
    }
    
    result.value = `【${f.holiday}节职工慰问活动方案】

一、活动主题
${f.holiday}送温暖 ${f.target}关怀行

二、活动目的
体现工会对职工的关心关爱，增强职工归属感和凝聚力。

三、活动概况

| 项目 | 内容 |
|-----|------|
| 节日 | ${f.holiday} |
| 慰问对象 | ${f.target} |
| 活动时间 | ${f.time || '节日期间'} |
| 预算标准 | ${f.budget || '待定'} |

四、活动安排

| 时间 | 内容 | 负责部门 |
|-----|------|---------|
| 节前一周 | 制定方案、采购物资 | 工会 |
| 节前3天 | 发放慰问品 | 工会 |
| 节日当天 | 开展活动 | 工会 |
| 节后一周 | 总结归档 | 工会 |

五、慰问内容

${holidayContent[f.holiday] || '根据实际情况安排'}

六、经费预算

| 项目 | 预算（元） | 备注 |
|-----|-----------|------|
| 慰问品采购 | | |
| 活动经费 | | |
| 宣传费用 | | |
| 其他费用 | | |
| 合计 | | |

七、组织分工
1. 活动策划：工会
2. 物资采购：办公室
3. 费用管理：财务部
4. 宣传报道：宣传部

八、工作要求
（一）精心组织，确保活动圆满成功
（二）厉行节约，严格控制经费开支
（三）广泛宣传，营造良好氛围
（四）及时总结，做好资料归档

九、本方案报工会审批后执行。

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
  a.download = `节日慰问_${form.value.holiday}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
