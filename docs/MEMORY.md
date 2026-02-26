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

### 5. 会员系统 + AI 生成
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

### 四大板块

| 子域名 | 说明 |
|--------|------|
| www.yunge.org.cn | 在线工具 |
| skills.yunge.org.cn | Skills 商店 |
| workflows.yunge.org.cn | 工作流下载 |
| agent.yunge.org.cn | Agent |

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
