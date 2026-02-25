# 渝工小工具 - 开发文档

## 一、工具清单（共 30+ 工具）

每个工具独立开发，互不干扰。

### 1. 文稿生成类（7个）

| 序号 | 工具ID | 工具名称 | 说明 |
|------|--------|----------|------|
| 1 | notice-generator | 通知公告生成器 | 快速生成工会通知、公告、函件 |
| 2 | report-generator | 工作报告生成器 | 年度/季度工作总结、汇报材料 |
| 3 | speech-generator | 发言稿生成器 | 职代会发言、领导讲话、先进表彰 |
| 4 | document-generator | 制度文件生成器 | 工会规章制度、管理办法 |
| 5 | letter-generator | 函件生成器 | 介绍信、证明信、邀请函 |
| 6 | summary-generator | 总结报告生成器 | 年度/季度/月度工作总结 |
| 7 | proposal-generator | 提案生成器 | 职工代表大会提案 |

### 2. 策划方案类（6个）

| 序号 | 工具ID | 工具名称 | 说明 |
|------|--------|----------|------|
| 8 | activity-plan | 活动策划生成器 | 文体活动、劳动竞赛、节日活动 |
| 9 | training-plan | 培训方案生成器 | 职工培训、技能提升方案 |
| 10 | employment-plan | 就业服务方案 | 招聘会、岗位推荐、帮扶就业方案 |
| 11 | competition-plan | 劳动竞赛方案 | 技能竞赛、创新大赛方案 |
| 12 | safety-plan | 安全活动方案 | 安全生产月活动方案 |
| 13 | volunteer-plan | 志愿服务方案 | 志愿者活动策划方案 |

### 3. 新媒体类（5个）

| 序号 | 工具ID | 工具名称 | 说明 |
|------|--------|----------|------|
| 14 | wechat-assistant | 公众号助手 | 推文生成、标题优化 |
| 15 | poster-text | 宣传文案生成 | 海报文案、宣传标语 |
| 16 | video-script | 短视频脚本 | 工会宣传视频、活动花絮 |
| 17 | poster-design | 海报文案设计 | 活动海报文字设计 |
| 18 | headline-generator | 标题生成器 | 吸引眼球的标题 |

### 4. 互动活动类（6个）

| 序号 | 工具ID | 工具名称 | 说明 |
|------|--------|----------|------|
| 19 | lottery | 幸运抽奖 | 全员参与抽取奖品 |
| 20 | qr-signin | 扫码签到 | 活动现场扫码签到 |
| 21 | questionnaire | 问卷调查 | 自定义问卷收集反馈 |
| 22 | voting | 在线投票 | 评选投票活动 |
| 23 | roll-call | 随机点名 | 现场随机抽取人员 |
| 24 | team-shuffle | 随机分组 | 将人员随机分成若干组 |

### 5. 实用工具类（7个）

| 序号 | 工具ID | 工具名称 | 说明 |
|------|--------|----------|------|
| 25 | contract-template | 合同协议模板 | 劳动合同、劳务协议参考 |
| 26 | meeting-notes | 会议纪要整理 | 智能整理会议记录 |
| 27 | calendar-work | 工作日历生成 | 生成年度工作日历 |
| 28 | expense-calculator | 工会经费计算 | 经费计提、支出计算 |
| 29 | staff-benefits | 职工福利计算 | 福利待遇核算 |
| 30 | holiday-notice | 节假日提醒 | 法定节假日通知生成 |
| 31 | quiz-generator | 题库生成器 | 根据文本/资料生成题库 |

---

## 二、技术架构

### 2.1 技术栈

- **前端**: Vue 3 + Vite + TailwindCSS
- **后端**: Node.js + Express
- **数据库**: SQLite（轻量级，无需额外安装）
- **部署**: 与现有 toolbox 共用服务器

### 2.2 目录结构

```
toolbox/
├── frontend/src/
│   ├── tools/                    # 所有工具组件
│   │   ├── NoticeGenerator.vue   # 工具1
│   │   ├── ReportGenerator.vue   # 工具2
│   │   ├── SpeechGenerator.vue   # 工具3
│   │   └── ...                   # 其他工具
│   ├── utils/
│   │   └── templates.js          # 所有工具的提示词模板
│   └── views/
│       └── Yugong.vue            # 渝工小工具首页
│
└── backend/src/
    └── routes/
        └── yugong.js             # 渝工相关API
```

---

## 三、工具开发规范

### 3.1 前端组件结构

每个工具组件保持统一结构：

```vue
<template>
  <div class="p-6">
    <!-- 工具标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-bold">{{ toolName }}</h2>
      <p class="text-gray-500">{{ description }}</p>
    </div>

    <!-- 输入表单 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium mb-1">字段名称</label>
        <input v-model="form.field" type="text" class="w-full border rounded px-3 py-2" />
      </div>
    </div>

    <!-- 生成按钮 -->
    <button @click="generate" :disabled="loading" class="btn-primary">
      {{ loading ? '生成中...' : '生成内容' }}
    </button>

    <!-- 结果展示 -->
    <div v-if="result" class="mt-6 p-4 bg-gray-50 rounded">
      <pre class="whitespace-pre-wrap">{{ result }}</pre>
      <button @click="copy" class="mt-2 btn-secondary">复制</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toolName = '通知公告生成器'
const description = '快速生成工会通知公告'
const form = ref({})
const result = ref('')
const loading = ref(false)

const generate = async () => {
  loading.value = true
  // 调用后端API或使用本地模板
  result.value = generateFromTemplate(form.value)
  loading.value = false
}

const generateFromTemplate = (data) => {
  return `关于${data.title || '活动'}的通知

${data.organization || 'XX工会'}：

为${data.content || '丰富职工文化生活'}...

联系人：${data.contact || ''}
联系电话：${data.phone || ''}

${data.organization || 'XX工会'}
${new Date().toLocaleDateString('zh-CN')}`
}

const copy = () => {
  navigator.clipboard.writeText(result.value)
}
</script>
```

### 3.2 工具注册方式

在 `frontend/src/utils/tools.js` 中添加：

```javascript
{
  id: 'notice-generator',
  name: '通知公告生成器',
  description: '快速生成工会通知公告',
  category: 'yugong',  // 新分类
  icon: '📢',
  component: defineAsyncComponent(() => import('../tools/NoticeGenerator.vue'))
}
```

---

## 四、模板系统

### 4.1 模板数据结构

```javascript
// frontend/src/utils/templates.js

export const templates = {
  'notice-generator': {
    name: '通知公告生成器',
    fields: [
      { name: 'title', label: '通知标题', required: true },
      { name: 'organization', label: '发布单位' },
      { name: 'content', label: '通知内容', type: 'textarea' },
      { name: 'time', label: '时间' },
      { name: 'location', label: '地点' },
      { name: 'contact', label: '联系人' },
      { name: 'phone', label: '联系电话' }
    ],
    generate: (data) => `...`
  },
  
  'report-generator': {
    name: '工作报告生成器',
    fields: [...],
    generate: (data) => `...`
  },
  
  // ... 其他工具
}
```

### 4.2 通用生成器组件

建议创建一个通用组件 `GenericTool.vue`，通过配置驱动，减少重复代码：

```vue
<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-2">{{ config.name }}</h2>
    <p class="text-gray-500 mb-6">{{ config.description }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div v-for="field in config.fields" :key="field.name">
        <label class="block text-sm font-medium mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <textarea
          v-if="field.type === 'textarea'"
          v-model="form[field.name]"
          class="w-full border rounded px-3 py-2"
          :placeholder="field.placeholder"
        ></textarea>
        <input
          v-else
          v-model="form[field.name]"
          type="text"
          class="w-full border rounded px-3 py-2"
          :placeholder="field.placeholder"
        />
      </div>
    </div>

    <button @click="generate" :disabled="loading" class="btn-primary">
      {{ loading ? '生成中...' : '生成内容' }}
    </button>

    <div v-if="result" class="mt-6 p-4 bg-gray-50 rounded">
      <pre class="whitespace-pre-wrap">{{ result }}</pre>
      <button @click="copy" class="mt-2 btn-secondary">复制</button>
    </div>
  </div>
</template>
```

---

## 五、API 设计

### 5.1 渝工相关 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/yugong/notify | 发送通知（可选） |
| POST | /api/yugong/save-history | 保存生成历史 |
| GET | /api/yugong/history | 获取历史记录 |

### 5.2 互动活动 API（需要后端支持）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/event/lottery | 抽奖 |
| POST | /api/event/signin | 签到 |
| POST | /api/event/questionnaire | 提交问卷 |
| GET | /api/event/stats | 统计数据 |

---

## 六、开发优先级

### 第一阶段：文稿生成（优先）

1. 通知公告生成器
2. 工作报告生成器
3. 发言稿生成器
4. 活动策划生成器

### 第二阶段：新媒体

5. 公众号助手
6. 短视频脚本
7. 宣传文案生成

### 第三阶段：实用工具

8. 合同协议模板
9. 会议纪要整理
10. 工作日历生成

### 第四阶段：互动活动（需要后端）

11. 幸运抽奖
12. 扫码签到
13. 问卷调查

---

## 七、模板示例

### 7.1 通知公告模板

```
关于{{title}}的通知

{{organization}}：

为{{content}}，现将有关事项通知如下：

一、{{item1}}
二、{{item2}}
三、{{item3}}

{% if contact %}
联系人：{{contact}}
{% endif %}
{% if phone %}
联系电话：{{phone}}
{% endif %}

{{organization}}
{{date}}
```

### 7.2 工作报告模板

```
{{title}}

一、上半年/年度工作概述
{{summary}}

二、主要工作回顾
{{highlights}}

三、取得的主要成绩
{{achievements}}

四、存在的问题
{{problems}}

五、下一步工作计划
{{nextPlan}}

六、结束语
{{conclusion}}
```

---

## 八、注意事项

1. **保持工具独立性**：每个工具单独组件，不相互依赖
2. **模板外置**：所有生成模板放在 `templates.js`，便于维护
3. **开箱即用**：不依赖外部 AI API，使用本地模板生成
4. **渐进增强**：后续可接入真实 AI 服务
5. **移动端适配**：所有工具支持手机端使用
