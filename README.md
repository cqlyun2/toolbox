# 工具箱 - 在线实用工具集合

一个类似腾讯帮小忙风格的在线工具箱网站，包含多种实用工具。

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
| 图片工具 | 图片压缩、调整尺寸、格式转换 |
| PDF工具 | PDF转Word、Word转PDF、PDF合并 |
| 文本工具 | 字数统计、JSON格式化 |
| 开发工具 | Base64编解码、URL编解码、时间戳转换、UUID生成 |
| 数据换算 | 单位换算、进制转换 |
| 生活工具 | 二维码生成、颜色选择器 |

## API 接口

### 图片处理
- `POST /api/image/compress` - 图片压缩
- `POST /api/image/resize` - 调整尺寸
- `POST /api/image/convert` - 格式转换

### PDF处理
- `POST /api/pdf/word-to-pdf` - Word转PDF
- `POST /api/pdf/merge` - PDF合并

### 文本处理
- `POST /api/text/count` - 字数统计
- `POST /api/text/format-json` - JSON格式化
- `POST /api/text/base64` - Base64编解码

## License

MIT
