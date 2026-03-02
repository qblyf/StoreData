#!/bin/bash

# 自动部署配置脚本

echo "================================================"
echo "StoreData 自动部署配置向导"
echo "================================================"
echo ""

# 选择部署方式
echo "请选择部署方式："
echo "1) 完整版 (SSH 密钥 + 测试 + 通知)"
echo "2) 简化版 (密码认证)"
echo "3) Rsync 版 (高效同步)"
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo "✓ 选择了完整版部署"
        rm -f .github/workflows/deploy-simple.yml
        rm -f .github/workflows/deploy-rsync.yml
        WORKFLOW="deploy.yml"
        ;;
    2)
        echo "✓ 选择了简化版部署"
        rm -f .github/workflows/deploy.yml
        rm -f .github/workflows/deploy-rsync.yml
        WORKFLOW="deploy-simple.yml"
        ;;
    3)
        echo "✓ 选择了 Rsync 版部署"
        rm -f .github/workflows/deploy.yml
        rm -f .github/workflows/deploy-simple.yml
        WORKFLOW="deploy-rsync.yml"
        ;;
    *)
        echo "✗ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "需要在 GitHub 设置以下 Secrets："
echo "================================================"
echo ""
echo "1. SERVER_HOST      - 服务器 IP 或域名"
echo "2. SERVER_USERNAME  - SSH 用户名"
echo "3. SERVER_PORT      - SSH 端口 (通常是 22)"
echo "4. DEPLOY_PATH      - 部署路径 (如 /var/www/storedata)"
echo ""

if [ "$choice" == "1" ] || [ "$choice" == "3" ]; then
    echo "5. SERVER_SSH_KEY   - SSH 私钥"
else
    echo "5. SERVER_PASSWORD  - SSH 密码"
fi

echo ""
echo "================================================"
echo "设置 Secrets 的步骤："
echo "================================================"
echo "1. 访问: https://github.com/qblyf/StoreData/settings/secrets/actions"
echo "2. 点击 'New repository secret'"
echo "3. 添加上述每个 secret"
echo ""
read -p "按 Enter 键继续..."

echo ""
echo "================================================"
echo "提交配置到 GitHub"
echo "================================================"
echo ""

git add .github/workflows/ nginx.conf AUTO_DEPLOY_GUIDE.md setup-deploy.sh
git commit -m "Configure auto deployment with $WORKFLOW"

echo ""
read -p "是否现在推送到 GitHub? (y/n) " push_now

if [[ $push_now =~ ^[Yy]$ ]]; then
    git push
    echo ""
    echo "================================================"
    echo "✓ 配置已推送到 GitHub"
    echo "================================================"
    echo ""
    echo "下一步："
    echo "1. 在 GitHub 设置 Secrets"
    echo "2. 准备服务器环境"
    echo "3. 推送代码测试自动部署"
    echo ""
    echo "查看部署状态："
    echo "https://github.com/qblyf/StoreData/actions"
else
    echo ""
    echo "配置已准备好，稍后可以手动推送："
    echo "git push"
fi

echo ""
echo "================================================"
echo "详细文档: AUTO_DEPLOY_GUIDE.md"
echo "================================================"
