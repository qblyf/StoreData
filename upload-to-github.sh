#!/bin/bash

# GitHub 上传脚本
# 使用方法: ./upload-to-github.sh YOUR_GITHUB_USERNAME REPO_NAME

# 检查参数
if [ $# -lt 2 ]; then
    echo "使用方法: ./upload-to-github.sh YOUR_GITHUB_USERNAME REPO_NAME"
    echo "示例: ./upload-to-github.sh john business-analytics-dashboard"
    exit 1
fi

USERNAME=$1
REPO_NAME=$2

echo "================================================"
echo "准备上传项目到 GitHub"
echo "================================================"
echo "GitHub 用户名: $USERNAME"
echo "仓库名称: $REPO_NAME"
echo "================================================"
echo ""

# 检查是否已有远程仓库
if git remote | grep -q "origin"; then
    echo "⚠️  检测到已存在的远程仓库"
    git remote -v
    echo ""
    read -p "是否要替换现有的远程仓库? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo "✓ 已移除旧的远程仓库"
    else
        echo "取消操作"
        exit 0
    fi
fi

# 添加远程仓库
echo "正在添加远程仓库..."
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

if [ $? -eq 0 ]; then
    echo "✓ 远程仓库添加成功"
else
    echo "✗ 添加远程仓库失败"
    exit 1
fi

echo ""
echo "================================================"
echo "准备推送代码到 GitHub"
echo "================================================"
echo "仓库地址: https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "注意: 如果这是第一次推送，GitHub 会要求你登录"
echo "      请使用 Personal Access Token 作为密码"
echo ""
read -p "按 Enter 键继续推送..."

# 推送到 GitHub
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✓ 上传成功！"
    echo "================================================"
    echo "访问你的仓库: https://github.com/$USERNAME/$REPO_NAME"
    echo ""
    echo "后续更新代码使用:"
    echo "  git add ."
    echo "  git commit -m \"你的提交信息\""
    echo "  git push"
    echo "================================================"
else
    echo ""
    echo "✗ 推送失败"
    echo ""
    echo "可能的原因:"
    echo "1. 仓库不存在 - 请先在 GitHub 上创建仓库"
    echo "2. 认证失败 - 请使用 Personal Access Token"
    echo "3. 网络问题 - 检查网络连接"
    echo ""
    echo "详细步骤请查看 GITHUB_UPLOAD_GUIDE.md"
    exit 1
fi
