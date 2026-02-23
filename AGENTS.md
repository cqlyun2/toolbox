# AGENTS.md - AI Coding Agent Guidelines

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

This is a full-stack online toolbox application similar to Tencent's "Bang Xiao Mang" (帮小忙).

- **Frontend**: Vue 3 + Vite + TailwindCSS + Vue Router
- **Backend**: Node.js + Express
- **Ports**: Frontend runs on port 3000, Backend runs on port 3001

---

## Build/Lint/Test Commands

### Frontend (from `frontend/` directory)

```bash
npm install          # Install dependencies
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend (from `backend/` directory)

```bash
npm install          # Install dependencies
npm run dev          # Start development server with --watch (port 3001)
npm start            # Start production server
```

### Running Both

```bash
# Terminal 1 (backend)
cd backend && npm run dev

# Terminal 2 (frontend)
cd frontend && npm run dev
```

### Testing

No test framework is currently configured. When adding tests:
- Frontend: Consider Vitest (Vite-native test runner)
- Backend: Consider Jest or Mocha

---

## Code Style Guidelines

### General Principles

1. **Language**: Code comments and UI text are primarily in Chinese (中文)
2. **Module System**: Use ES Modules (ESM) with `import/export` syntax
3. **No TypeScript**: This is a JavaScript-only project
4. **No Comments**: Do not add comments to code unless explicitly requested

### Frontend (Vue 3)

#### Component Structure

Use Vue 3 Composition API with `<script setup>` syntax:

```vue
<template>
  <!-- Template content -->
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const someVar = ref('')
const computedVar = computed(() => someVar.value.toUpperCase())
</script>
```

#### Imports

Group imports in this order:
1. Vue APIs (`vue`, `vue-router`)
2. Local utilities (`../utils/...`)
3. Local components (`../components/...`)

```javascript
import { ref, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import { tools, getToolById } from '../utils/tools'
import ToolCard from '../components/ToolCard.vue'
```

#### Props Definition

Use `defineProps` with object syntax:

```javascript
const props = defineProps({
  tool: {
    type: Object,
    required: true
  }
})
```

#### Styling

- Use TailwindCSS utility classes exclusively
- No scoped styles or CSS modules
- Follow existing color patterns: `bg-blue-500`, `text-gray-700`, etc.
- Custom utility classes are defined in `main.css` (e.g., `.card-hover`)

#### Component Naming

- Use PascalCase for component files: `ToolCard.vue`, `ImageCompress.vue`
- Use kebab-case for tool IDs: `image-compress`, `base64`
- Tool components are placed in `src/tools/` directory

#### Router

- Use lazy loading for route components: `() => import('../views/Home.vue')`
- Route names use PascalCase: `Home`, `Category`, `Tool`

### Backend (Express)

#### Route Structure

Each route module follows this pattern:

```javascript
import express from 'express'
import multer from 'multer'

const router = express.Router()

router.post('/endpoint', async (req, res) => {
  try {
    // validation
    if (!req.body.field) {
      return res.status(400).json({ error: '错误信息' })
    }
    
    // processing
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

#### Error Handling

- Return 400 for client errors with `{ error: 'message' }`
- Return 500 for server errors with `{ error: error.message }`
- Return 200 for success with `{ success: true, ...data }`

#### File Uploads

Use multer for file handling:

```javascript
const upload = multer({ 
  storage: multer.diskStorage({...}),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png']
    cb(null, allowedTypes.includes(file.mimetype))
  }
})

router.post('/upload', upload.single('file'), handler)
```

#### ES Modules in Backend

Use `fileURLToPath` and `path.dirname` for `__dirname`:

```javascript
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
```

### File Organization

```
frontend/
├── src/
│   ├── assets/        # CSS, images
│   ├── components/    # Reusable Vue components
│   ├── tools/         # Individual tool components
│   ├── views/         # Page-level Vue components
│   ├── router/        # Vue Router configuration
│   ├── utils/         # JavaScript utilities
│   ├── App.vue        # Root component
│   └── main.js        # Entry point

backend/
├── src/
│   ├── routes/        # Express route handlers
│   └── app.js         # Express app configuration
└── uploads/           # Uploaded files directory
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Vue Components | PascalCase | `ToolCard.vue` |
| Tool IDs | kebab-case | `image-compress` |
| Route endpoints | kebab-case | `/api/image/compress` |
| JavaScript variables | camelCase | `searchQuery` |
| Constants | camelCase | `categories`, `tools` |
| CSS classes | kebab-case | `card-hover` |

---

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "错误描述"
}
```

---

## Adding New Tools

1. Add tool definition to `frontend/src/utils/tools.js`:

```javascript
{
  id: 'new-tool',
  name: '工具名称',
  description: '工具描述',
  category: 'dev',
  icon: '🔧',
  hot: false  // optional
}
```

2. Create component in `frontend/src/tools/NewTool.vue`

3. Register component in `frontend/src/views/Tool.vue`:

```javascript
const toolComponents = {
  'new-tool': defineAsyncComponent(() => import('../tools/NewTool.vue')),
  // ...
}
```

4. Add backend route if needed in `backend/src/routes/`

---

## Important Notes

- The project uses Chinese for UI text and error messages
- No linting tools are currently configured
- No test framework is currently configured
- Use existing patterns when adding new features
- Keep components small and focused on a single responsibility
