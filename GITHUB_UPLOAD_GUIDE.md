# GitHub 上传指南

本项目已完成 Git 初始化和首次提交。以下是将项目上传到 GitHub 的步骤：

## 方法一：通过 GitHub 网站创建仓库（推荐）

### 1. 在 GitHub 上创建新仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `business-analytics-dashboard` （或你喜欢的名称）
   - **Description**: `Business Analytics Dashboard with Market Brand Analysis`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已有代码）
4. 点击 "Create repository"

### 2. 连接本地仓库到 GitHub

在终端中执行以下命令（将 `YOUR_USERNAME` 替换为你的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/business-analytics-dashboard.git

# 推送代码到 GitHub
git push -u origin master
```

### 3. 验证上传

访问你的 GitHub 仓库页面，确认所有文件已成功上传。

## 方法二：使用 GitHub CLI（如果已安装）

```bash
# 创建仓库并推送
gh repo create business-analytics-dashboard --public --source=. --remote=origin --push
```

## 后续更新代码

当你修改代码后，使用以下命令更新到 GitHub：

```bash
# 查看修改的文件
git status

# 添加所有修改的文件
git add .

# 提交修改
git commit -m "描述你的修改内容"

# 推送到 GitHub
git push
```

## 项目信息

- **提交数量**: 1 个初始提交
- **文件数量**: 156 个文件
- **代码行数**: 37,959 行
- **主要功能**:
  - 业务分析仪表板
  - 市场品牌分析模块
  - 品牌对比图表
  - 市场概览图表
  - 员工绩效追踪
  - KPI 监控和告警
  - 数据筛选和导出
  - 响应式设计

## 建议的仓库设置

### README.md 内容
项目已包含详细的 README.md 文件，包含：
- 项目介绍
- 功能特性
- 安装步骤
- 使用说明
- 技术栈

### 添加 GitHub Topics（标签）
在 GitHub 仓库页面添加以下 topics：
- `react`
- `typescript`
- `dashboard`
- `analytics`
- `business-intelligence`
- `data-visualization`
- `recharts`
- `vite`

### 启用 GitHub Pages（可选）
如果想要在线演示：
1. 构建项目: `npm run build`
2. 在仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支或 `/docs` 文件夹

## 常见问题

### Q: 推送时要求输入用户名和密码？
A: GitHub 已不再支持密码认证，需要使用 Personal Access Token：
1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 生成新的 token
3. 使用 token 作为密码

### Q: 如何修改远程仓库地址？
```bash
git remote set-url origin https://github.com/NEW_USERNAME/NEW_REPO.git
```

### Q: 如何查看远程仓库信息？
```bash
git remote -v
```

## 下一步

上传成功后，你可以：
1. 添加 GitHub Actions 进行 CI/CD
2. 设置分支保护规则
3. 邀请协作者
4. 创建 Issues 和 Projects 管理任务
5. 添加 LICENSE 文件
6. 配置自动部署到 Vercel 或 Netlify

## 联系支持

如果遇到问题，可以：
- 查看 [GitHub 文档](https://docs.github.com)
- 访问 [GitHub Community](https://github.community)
