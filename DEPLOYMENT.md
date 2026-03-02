# 部署说明

## 服务器信息
- 服务器地址：1.95.137.107
- 用户：root
- Web 服务器：Nginx

## 访问地址
http://1.95.137.107/dashboard/

## 部署位置
- 项目文件：`/var/www/business-dashboard/`
- Nginx 配置：`/etc/nginx/sites-available/annttdd`

## 重新部署步骤

1. 本地构建项目：
```bash
npm run build
```

2. 打包构建文件：
```bash
tar czf dist.tar.gz -C dist .
```

3. 上传到服务器：
```bash
sshpass -p 'Ll2196539.' scp -o StrictHostKeyChecking=no dist.tar.gz root@1.95.137.107:/tmp/dist-new.tar.gz
```

4. 解压并部署：
```bash
sshpass -p 'Ll2196539.' ssh -o StrictHostKeyChecking=no root@1.95.137.107 "rm -rf /var/www/business-dashboard/* && cd /var/www/business-dashboard && tar xzf /tmp/dist-new.tar.gz"
```

5. 重启 Nginx（如需要）：
```bash
sshpass -p 'Ll2196539.' ssh -o StrictHostKeyChecking=no root@1.95.137.107 "systemctl reload nginx"
```

## Nginx 配置

项目配置在主站点配置中，使用路径前缀 `/dashboard/`：

```nginx
location /dashboard/ {
    alias /var/www/business-dashboard/;
    index index.html;
    try_files $uri $uri/ /dashboard/index.html;
}
```

## 注意事项

- 项目使用 `/dashboard/` 作为 base path（在 vite.config.ts 中配置）
- 与现有项目共享 80 端口，通过路径区分
- 静态资源自动启用 gzip 压缩和缓存
