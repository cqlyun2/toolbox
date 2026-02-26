# 对话记录：渝工小工具 + 平台规划

## 日期
2026-02-26

## 参与者
- 用户：cqlyun2
- AI：opencode

---

## 背景

用户有一个工具箱网站 (www.yunge.org.cn)，部署在服务器上。最开始有本地和服务器显示不同的问题，原因是：
1. API 代理配置不同
2. 路径问题（子目录部署）

解决方案：改用子域名方式部署。

---

## 开发历程

### 1. 部署问题
- 本地运行正常，服务器显示不同
- 尝试子目录部署方案
- 遇到 502 错误
- 解决方案：改用子域名 toolbox.yunge.org.cn（后改为 www.yunge.org.cn）

### 2. 代码整理
清理了本地 D:\www\ 目录，只保留：
- toolbox/ (现有工具箱)
- gonghui-ai/ (渝工小工具源码，Next.js)
- cqgh-weixin/

### 3. GitHub 推送
- 推送到 github.com/cqlyun2/toolbox
- 服务器从 GitHub 拉取部署

### 4. 渝工小工具开发（第一晚）
10 个工具：
1. 通知公告生成器
2. 工作报告生成器
3. 发言稿生成器
4. 活动策划生成器
5. 培训方案生成器
6. 就业服务方案
7. 公众号助手
8. 短视频脚本
9. 随机分组
10. 随机点名

### 6. 渝工小工具扩展（第二晚）
新增10个工具，共20个：
11. 规章制度模板 (RulesTemplate.vue)
12. 劳动法律咨询 (LaborLaw.vue)
13. 困难职工帮扶方案 (AssistancePlan.vue)
14. 职工心理健康 (MentalHealth.vue)
15. 工会经费管理 (FundManagement.vue)
16. 评优评先方案 (EvaluationPlan.vue)
17. 团建活动方案 (TeamBuilding.vue)
18. 节日慰问方案 (HolidayCare.vue)
19. 劳模事迹材料 (ModelStory.vue)
20. 工资集体协商 (WageNegotiation.vue)

### 7. 渝工小工具扩展（第三晚）
新增10个工具，共30个：
21. 会议纪要 (MeetingMinutes.vue)
22. 新闻稿 (NewsRelease.vue)
23. 职工代表提案 (Proposal.vue)
24. 慰问信 (SympathyLetter.vue)
25. 应急预案 (EmergencyPlan.vue)
26. 集体合同 (CollectiveContract.vue)
27. 预算决算报告 (BudgetReport.vue)
28. 会员管理 (Membership.vue)
29. 劳保用品管理 (LaborProtection.vue)

**新增文件**：
- frontend/src/tools/MeetingMinutes.vue
- frontend/src/tools/NewsRelease.vue
- frontend/src/tools/Proposal.vue
- frontend/src/tools/SympathyLetter.vue
- frontend/src/tools/EmergencyPlan.vue
- frontend/src/tools/CollectiveContract.vue
- frontend/src/tools/BudgetReport.vue
- frontend/src/tools/Membership.vue
- frontend/src/tools/LaborProtection.vue

**修改文件**：
- frontend/src/utils/tools.js - 添加10个工具定义
- frontend/src/views/Tool.vue - 注册10个新组件
- backend/src/routes/ai.js - 添加10个AI提示模板

### 8. UI界面优化
- 新增顶部板块导航：Web小工具、渝工小工具、技能商店、工作流下载、Agent
- 创建独立页面：YugongHome.vue（渝工小工具首页）
- 左侧子分类导航（7个子分类：中国传统色系配色）
- 右侧卡片式工具展示
- 优化ToolCard组件：支持自定义颜色、更大卡片尺寸
- 接入硅基流动 API (Token: sk-anyafxkwugtxkoffihfcwbbyafiubeypdiwbldsqkrsjyuen)
- 余额：5.41 元
- 模型：Qwen/Qwen2.5-7B-Instruct

**定价**：
- 月度会员：99 元
- 季度会员：199 元
- 年度会员：999 元

**功能**：
- 手机号注册/登录
- VIP 会员系统
- 新用户 3 次免费
- AI 智能生成

**修改文件**：
- backend/src/routes/vip.js
- backend/src/routes/ai.js
- backend/.env
- frontend/src/tools/NoticeGenerator.vue (示例)
- frontend/src/views/Vip.vue
- frontend/src/components/LoginModal.vue
- frontend/src/components/UserMenu.vue
- frontend/src/App.vue
- frontend/src/router/index.js
- frontend/src/utils/tools.js

---

## 平台规划

### 五大板块

| 子域名 | 说明 | 状态 |
|--------|------|------|
| www.yunge.org.cn | Web小工具 | 已完成 |
| yugong.yunge.org.cn | 渝工小工具 | 开发中 |
| skills.yunge.org.cn | 技能商店 | 待开发 |
| workflows.yunge.org.cn | 工作流下载 | 待开发 |
| agent.yunge.org.cn | Agent | 待开发 |

---

## 待办

1. [ ] 本地测试会员系统
2. [ ] 推送代码到 GitHub
3. [ ] 服务器部署更新
4. [ ] 完善支付接口
5. [ ] 继续开发剩余渝工小工具

---

## 备注

- 对话上下文需要保存记忆
- 用户考虑后续开发 skills、工作流、agent 三大板块
