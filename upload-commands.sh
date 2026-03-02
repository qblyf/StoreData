#!/bin/bash

# GitHub 上传命令
# 请将 YOUR_USERNAME 替换为你的 GitHub 用户名

echo "================================================"
echo "GitHub 上传命令"
echo "================================================"
echo ""
echo "请先在 GitHub 上创建仓库 StoreData"
echo "然后将下面命令中的 YOUR_USERNAME 替换为你的 GitHub 用户名"
echo ""
echo "================================================"
echo ""

# 显示需要执行的命令
cat << 'EOF'
# 1. 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/StoreData.git

# 2. 查看远程仓库是否添加成功
git remote -v

# 3. 推送代码到 GitHub
git push -u origin master

# 4. 如果推送成功，访问你的仓库
# https://github.com/YOUR_USERNAME/StoreData
EOF

echo ""
echo "================================================"
echo "注意事项："
echo "================================================"
echo "1. 首次推送需要 GitHub 认证"
echo "2. 用户名：你的 GitHub 用户名"
echo "3. 密码：使用 Personal Access Token（不是登录密码）"
echo ""
echo "如何获取 Personal Access Token："
echo "1. 访问 https://github.com/settings/tokens"
echo "2. 点击 'Generate new token (classic)'"
echo "3. 勾选 'repo' 权限"
echo "4. 生成并复制 token"
echo "5. 在推送时使用 token 作为密码"
echo "================================================"
