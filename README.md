# 雲歌工具小站

一个类似腾讯帮小忙风格的在线工具箱网站，提供多种实用工具。

## 网站地址

https://yunge.org.cn

## 技术栈

**前端:**
- Vue 3 + Vite
- TailwindCSS
- Vue Router

**后端:**
- Node.js + Express
- 文件处理: sharp, pdf-lib, mammoth

## 项目结构

```
toolbox/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── tools/
│   │   ├── router/
│   │   └── utils/
│   └── package.json
│
├── backend/           # 后端项目
│   ├── src/
│   │   ├── routes/
│   │   └── app.js
│   └── package.json
│
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 2. 启动服务

```bash
# 启动后端 (在 backend 目录)
npm run dev

# 启动前端 (在 frontend 目录，新终端)
npm run dev
```

### 3. 访问

- 前端: http://localhost:3000
- 后端: http://localhost:3001

## 工具分类

| 分类 | 工具 |
|------|------|
| 图片工具 | 图片压缩、调整尺寸、格式转换、图片裁剪 |
| PDF工具 | PDF转Word、Word转PDF、PDF合并、PDF拆分 |
| 文本工具 | 字数统计、JSON格式化、文本占位符 |
| 开发工具 | Base64编解码、URL编解码、时间戳转换、UUID生成、正则测试器、哈希生成器 |
| 数据换算 | 单位换算、进制转换 |
| 生活工具 | 二维码生成、颜色选择器、天气查询、今天吃什么、密码生成器、随机抽奖 |
| AI工具 | Prompt模板库、Token估算器、AI绘画提示词、Prompt优化器 |

## 功能特性

- 用户注册/登录
- 工具收藏
- 使用历史记录
- 深色模式
- 响应式设计

## License

MIT
