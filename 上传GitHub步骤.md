# 上传 GitHub 详细步骤

## 第一步：创建 GitHub 仓库

### 1. 登录 GitHub
访问 https://github.com 并登录你的账号

### 2. 创建新仓库
1. 点击右上角的 "+" 按钮
2. 选择 "New repository"
3. 填写信息：
   - **Repository name**: `StoreData`
   - **Description**: `Business Analytics Dashboard - 门店数据分析仪表板`
   - **Public/Private**: 根据需要选择
   - ⚠️ **重要**: 不要勾选任何初始化选项（README、.gitignore、License）
4. 点击 "Create repository"

### 3. 记录你的 GitHub 用户名
创建完成后，页面会显示仓库地址，例如：
```
https://github.com/你的用户名/StoreData
```
记住这个用户名，下一步会用到。

---

## 第二步：上传代码

### 方法 A：使用命令行（推荐）

在项目目录下打开终端，执行以下命令：

```bash
# 1. 添加远程仓库（将 你的用户名 替换为实际的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/StoreData.git

# 2. 验证远程仓库
git remote -v

# 3. 推送代码
git push -u origin master
```

### 方法 B：使用脚本

```bash
./upload-to-github.sh 你的用户名 StoreData
```

---

## 第三步：身份验证

首次推送时，系统会要求输入凭据：

### 用户名
输入你的 GitHub 用户名（不是邮箱）

### 密码
⚠️ **不要使用登录密码！** 需要使用 Personal Access Token

#### 如何获取 Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写信息：
   - **Note**: `StoreData Upload`
   - **Expiration**: 选择有效期（建议 90 days）
   - **Select scopes**: 勾选 `repo`（完整的仓库访问权限）
4. 点击 "Generate token"
5. **重要**: 复制生成的 token（只显示一次！）
6. 在推送时，将这个 token 作为密码输入

---

## 第四步：验证上传

推送成功后：

1. 访问 https://github.com/你的用户名/StoreData
2. 确认所有文件已上传
3. 查看 README.md 是否正确显示

---

## 常见问题

### Q1: 提示 "remote origin already exists"
```bash
# 删除现有的远程仓库
git remote remove origin

# 重新添加
git remote add origin https://github.com/你的用户名/StoreData.git
```

### Q2: 推送失败，提示认证错误
- 确保使用的是 Personal Access Token，不是登录密码
- 检查 token 是否有 `repo` 权限
- 确认 token 未过期

### Q3: 推送失败，提示仓库不存在
- 确认仓库名称拼写正确：`StoreData`
- 确认用户名正确
- 确认已在 GitHub 上创建了仓库

### Q4: 如何找到我的 GitHub 用户名？
1. 登录 GitHub
2. 点击右上角头像
3. 用户名显示在头像下方（格式：@username）

---

## 项目信息

- **项目名称**: StoreData
- **文件数量**: 156 个文件
- **代码行数**: 37,959 行
- **提交信息**: "Initial commit: Business Analytics Dashboard with Market Brand Module"

---

## 后续更新代码

上传成功后，以后更新代码只需：

```bash
# 1. 查看修改
git status

# 2. 添加修改
git add .

# 3. 提交修改
git commit -m "描述你的修改"

# 4. 推送到 GitHub
git push
```

---

## 需要帮助？

如果遇到问题：
1. 查看 `GITHUB_UPLOAD_GUIDE.md`
2. 访问 GitHub 文档：https://docs.github.com
3. 检查错误信息并搜索解决方案

---

**祝上传顺利！** 🚀
