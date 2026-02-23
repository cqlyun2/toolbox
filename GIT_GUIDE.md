# Git 使用指南

## 一、首次配置（新电脑只需执行一次）

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

---

## 二、新建仓库并推送到 GitHub

### 步骤 1：进入项目目录
```bash
cd 你的项目路径
```

### 步骤 2：初始化 Git 仓库
```bash
git init
```

### 步骤 3：创建 .gitignore 文件
```bash
echo node_modules/ > .gitignore
echo uploads/ >> .gitignore
echo *.log >> .gitignore
echo .DS_Store >> .gitignore
```

### 步骤 4：添加文件并提交
```bash
git add .
git commit -m "初始提交"
```

### 步骤 5：在 GitHub 创建仓库
1. 访问 https://github.com/new
2. 填写仓库名称
3. **不要勾选** "Add a README file"
4. 点击 **Create repository**

### 步骤 6：关联远程仓库并推送
```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

---

## 三、日常同步代码（本地推送）

每次修改代码后，在 **Git Bash** 中执行：

```bash
cd ~/toolbox
git add .
git commit -m "描述你的修改"
git push origin main
```

### 提交信息规范示例
```bash
git commit -m "添加登录功能"
git commit -m "修复图片压缩bug"
git commit -m "更新README文档"
git commit -m "优化首页样式"
```

---

## 四、服务器更新部署

### 登录服务器
```bash
ssh root@你的服务器IP
```

### 更新代码并重新构建
```bash
# 进入项目目录
cd ~/toolbox

# 拉取最新代码
git pull origin main

# 更新前端
cd frontend
npm run build

# 更新后端（如有依赖变更）
cd ../backend
npm install

# 重启后端服务
pm2 restart all
```

### 一键更新脚本（可保存为 update.sh）
```bash
#!/bin/bash
cd ~/toolbox
git pull origin main
cd frontend && npm run build
cd ../backend && npm install
pm2 restart all
echo "更新完成！"
```

---

## 五、从 GitHub 克隆项目到本地

```bash
git clone https://github.com/你的用户名/仓库名.git
```

---

## 六、常用命令速查

| 命令 | 作用 |
|------|------|
| `git status` | 查看当前状态 |
| `git log --oneline` | 查看提交历史 |
| `git diff` | 查看修改内容 |
| `git pull` | 拉取远程更新 |
| `git clone 地址` | 克隆远程仓库 |
| `git branch` | 查看分支 |

---

## 七、常见问题

### 问题：每次 push 都要输入密码
解决：使用 SSH 或配置凭据缓存
```bash
git config --global credential.helper store
```

### 问题：想撤销某次提交
```bash
git reset --soft HEAD~1    # 撤销提交，保留修改
git reset --hard HEAD~1    # 撤销提交，丢弃修改
```

### 问题：合并冲突
1. 手动编辑冲突文件
2. `git add .`
3. `git commit -m "解决冲突"`

---

## 八、本项目信息

- **仓库名称**: 雲歌工具小站
- **仓库地址**: https://github.com/cqlyun2/toolbox
- **网站地址**: https://yunge.org.cn
