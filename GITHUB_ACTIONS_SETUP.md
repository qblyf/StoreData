# GitHub Actions 自动部署配置指南

## 🎯 配置概述

已为你的项目配置好 GitHub Actions 自动部署，当你推送代码到 master 或 main 分支时，会自动：
1. ✅ 安装依赖
2. ✅ 运行测试
3. ✅ 构建项目
4. ✅ 备份当前版本
5. ✅ 部署到服务器
6. ✅ 重新加载 Nginx

## 📋 需要配置的 GitHub Secrets

访问你的 GitHub 仓库设置页面：
```
https://github.com/你的用户名/你的仓库名/settings/secrets/actions
```

点击 "New repository secret" 添加以下配置：

### 必需的 Secrets

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `SERVER_HOST` | `1.95.137.107` | 服务器 IP 地址 |
| `SERVER_USERNAME` | `root` | SSH 用户名 |
| `SERVER_PASSWORD` | `你的服务器密码` | SSH 登录密码 |
| `SERVER_PORT` | `22` | SSH 端口（可选，默认 22） |

## 🚀 配置步骤

### 第一步：添加 GitHub Secrets

1. 打开你的 GitHub 仓库
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Secrets and variables** > **Actions**
4. 点击 **New repository secret**
5. 依次添加上面表格中的 4 个 secrets

### 第二步：推送代码触发部署

```bash
# 添加修改
git add .

# 提交
git commit -m "配置自动部署"

# 推送到 GitHub
git push origin master
```

### 第三步：查看部署进度

1. 访问你的仓库 Actions 页面：
   ```
   https://github.com/你的用户名/你的仓库名/actions
   ```

2. 点击最新的 workflow run 查看部署日志

3. 部署成功后，访问：
   ```
   http://1.95.137.107/dashboard/
   ```

## 📁 部署配置文件

项目中有三个部署配置文件，已经为你优化了 `deploy-simple.yml`：

- ✅ **deploy-simple.yml** - 推荐使用（已优化）
  - 使用密码认证
  - 自动备份
  - 自动重载 Nginx
  - 包含详细的部署日志

- **deploy.yml** - 使用 SSH 密钥认证
- **deploy-rsync.yml** - 使用 rsync 同步

如果只想使用一个配置，可以删除其他两个：

```bash
# 保留 deploy-simple.yml，删除其他
rm .github/workflows/deploy.yml
rm .github/workflows/deploy-rsync.yml

git add .
git commit -m "清理多余的部署配置"
git push
```

## 🔍 部署流程说明

```
代码推送到 GitHub
    ↓
GitHub Actions 自动触发
    ↓
安装依赖 (npm ci)
    ↓
运行测试 (npm test)
    ↓
构建项目 (npm run build)
    ↓
上传到服务器 /tmp 目录
    ↓
备份当前版本
    ↓
替换为新版本
    ↓
设置文件权限
    ↓
重新加载 Nginx
    ↓
部署完成 ✅
```

## 🛡️ 安全特性

1. ✅ 自动备份：每次部署前自动备份当前版本
2. ✅ 保留历史：保留最近 3 个备份版本
3. ✅ 权限设置：自动设置正确的文件权限
4. ✅ Nginx 测试：部署前测试 Nginx 配置

## 🔧 手动触发部署

如果需要手动触发部署（不推送代码）：

1. 访问 Actions 页面
2. 选择 "Auto Deploy to Server" workflow
3. 点击 "Run workflow" 按钮
4. 选择分支并点击 "Run workflow"

## 📊 查看部署状态

部署过程中可以看到：
- 📦 构建大小
- 📁 文件数量
- ⏱️ 部署时间
- ✅ 每个步骤的执行状态

## ❓ 常见问题

### Q1: 部署失败，提示连接超时
**解决方案：**
- 检查服务器 IP 是否正确
- 确认服务器防火墙允许 GitHub Actions 的 IP 访问
- 验证 SSH 端口是否为 22

### Q2: 部署失败，提示权限错误
**解决方案：**
```bash
# 在服务器上执行
sudo chown -R www-data:www-data /var/www/business-dashboard
sudo chmod -R 755 /var/www/business-dashboard
```

### Q3: 部署成功但网站无法访问
**解决方案：**
```bash
# 在服务器上检查 Nginx 状态
sudo systemctl status nginx

# 检查 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### Q4: 如何回滚到之前的版本？
**解决方案：**
```bash
# 在服务器上查看备份
ls -la /var/www/business-dashboard-backup-*

# 恢复备份（替换日期时间）
sudo rm -rf /var/www/business-dashboard/*
sudo cp -r /var/www/business-dashboard-backup-20240302_143000/* /var/www/business-dashboard/
sudo systemctl reload nginx
```

## 🎯 下一步优化建议

1. **使用 SSH 密钥认证**（更安全）
   - 生成 SSH 密钥对
   - 将公钥添加到服务器
   - 使用 `deploy.yml` 配置

2. **配置 SSL 证书**
   - 使用 Let's Encrypt 免费证书
   - 启用 HTTPS 访问

3. **添加部署通知**
   - 集成钉钉/企业微信通知
   - 邮件通知

4. **性能监控**
   - 添加部署后的健康检查
   - 监控网站响应时间

## 📞 需要帮助？

- GitHub Actions 文档: https://docs.github.com/actions
- Nginx 文档: https://nginx.org/en/docs/

---

**准备就绪！** 配置好 GitHub Secrets 后，推送代码即可自动部署。
