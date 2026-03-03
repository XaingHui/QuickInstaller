# QuickInstaller 阿里云全栈部署指引

将本项目部署至阿里云（或其他云服务器）主要分为**环境初始化**、**打包发布**、**进程管理**以及 **Nginx 反向代理**四个核心阶段。

---

## 1. 阿里云环境初始化 (ECS)
建议选择系统：**Ubuntu 22.04 LTS** 或 **CentOS 7.9+**。

### 基础依赖安装
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Python 与 前端依赖
sudo apt install python3-pip python3-venv nodejs npm nginx git -y
```

### 开放安全组端口 (阿里云控制台)
在阿里云后台“安全组”中手动开启以下端口：
- **80** (HTTP)
- **443** (HTTPS)
- **3000** (前端测试，生产建议走 80)
- **8000** (后端 API，生产建议走 Nginx)

---

## 2. 后端部署 (FastAPI)

### 2.1 代码部署与环境
```bash
cd /opt
git clone <your-repo-url> QuickInstaller
cd QuickInstaller/backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2.2 环境变量配置
创建并编辑 `.env` 文件：
```bash
DATABASE_URL=sqlite:///./quickinstaller.db
# 或使用阿里云 RDS MySQL:
# DATABASE_URL=mysql+pymysql://user:pass@rds_host:3306/db_name
```

### 2.3 使用 PM2 或 Systemd 守护进程
为了防止终端退出后后端停止运行，建议使用管理器（以 PM2 为例）：
```bash
sudo npm install pm2 -g
pm2 start "python3 main.py" --name quick-backend
```

---

## 3. 前端部署 (React + Vite)

### 3.1 生产构建
在阿里云服务器或本地打包：
```bash
cd ../client
npm install
npm run build
```
编译后会生成 `dist` 文件夹，这是我们需要部署的静态资源。

---

## 4. Nginx 生产级详细配置 (零基础极速上手)

### 4.1 为什么要用 Nginx？ (通俗版)
你可以把 Nginx 想象成你网站的“**总前台**”：
- 用户访问服务器 IP 时，Nginx 就像大堂经理。
- 用户要看网页，Nginx 就去 `client/dist` 拿。
- 用户要调用 API，Nginx 就转交给后端的 FastAPI。
- **为什么要它？** 因为它处理静态页面极快，能承受巨大流量，还能给你的后端加一层安全盾牌。

### 4.2 配置文件精讲 (操作步骤)
1. **安装**：`sudo apt install nginx -y`
2. **定位配置**：Nginx 的主要配置文件路径是 `/etc/nginx/sites-available/default`。
3. **编辑**：使用 `sudo nano` 或 `sudo vi` 命令编辑该文件。

### 4.1 配置文件精讲
编辑 `/etc/nginx/sites-available/default`（建议先备份），替换为以下生产级配置：

```nginx
server {
    listen 80;
    server_name _; # 重点：没有域名就写下划线，代表直接通过服务器公网 IP 访问

    # 1. 性能优化：开启 Gzip 压缩指令
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # 2. 上传限制优化 (关键：防止上传脚本时报 413 Payload Too Large)
    client_max_body_size 50M; 

    # 3. 前端静态资源 (React/Vite Build 产物)
    location / {
        root /opt/QuickInstaller/client/dist;
        index index.html;
        # 兼容 React 路由：如果路径不存在则重定向到 index.html
        try_files $uri $uri/ /index.html;
    }

    # 4. 后端 API 反向代理 (转发给 FastAPI 进程)
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 增加超时限制，防止大脚本上传超时
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    # 5. 用户上传的脚本文件目录映射
    location /uploads {
        alias /opt/QuickInstaller/backend/uploads;
        autoindex off;
    }
}
```

### 4.2 配置验证与生效
```bash
# 检查配置文件是否有语法错误
sudo nginx -t

# 重启服务
sudo systemctl restart nginx
```

---

## 5. SSL 证书 (HTTPS) 进阶配置
强力建议开启 HTTPS，阿里云服务器可以使用 **Certbot** 一键申请免费证书。

```bash
# 1. 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 2. 自动配置 SSL (请确保域名已指向服务器 IP，且 80/443 全部开启)
sudo certbot --nginx -d your_domain.com

# 3. Certbot 会自动修改 /etc/nginx/sites-available/default 
# 并添加定时任务自动续期。
```

---

## ❓ 常见疑问：能不能用 GitHub Pages 部署？

**结论：只能跑前端，跑不了后台和数据库。**

- **GitHub Pages (github.io)**: 它是“静态托管”。这意味着它只能帮你运行编译后的 HTML、CSS 和 JavaScript 文件。
- **本项目 (QuickInstaller)**: 它是一个“动态全栈项目”。
    - 它需要运行 **Python 代码** 来处理登录、分发脚本。
    - 它需要一个 **数据库 (SQLite)** 来存储用户信息。
- **方案建议**: 
    - 如果你想省钱，前端可以丢在 GitHub Pages / Vercel 上。
    - 但你的 **`backend/` 文件夹** 依然必须跑在一台 24 小时在线的服务器（如阿里云）上，否则前端登录和下载功能将全部失效。

**所以，为了让你的极客商店真正跑起来，一台云服务器（ECS）依然是目前最完整、最省心的选择。**
