# QuickInstaller 开发手册

本项目是一个全栈脚本分发与环境自动化配置平台。采用前后端分离架构，旨在为开发者提供一个极致简约、高性能且易于维护的代码仓库管理系统。

## 🛠 技术栈

### 后端 (Backend)
- **框架**: [FastAPI](https://fastapi.tiangolo.com/) (异步高性能 Python web 框架)
- **数据库 ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **迁移工具**: [Alembic](https://alembic.sqlalchemy.org/) (支持无感数据库 schema 热更新)
- **认证**: JWT (JSON Web Tokens) + Bcrypt 密码哈希
- **服务运行**: Uvicorn (ASGI 服务)

### 前端 (Frontend)
- **构建工具**: [Vite](https://vitejs.dev/)
- **框架**: [React](https://reactjs.org/)
- **组件库**: [Lucide-React](https://lucide.dev/) (图标)
- **样式**: Vanilla CSS (极客风格，深度定制毛玻璃与动态背景)

---

## 🚀 快速开始 (开发环境)

### 1. 后端配置
确保已安装 Python 3.10+。

```bash
cd backend
# 建议创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
# 编辑 .env 文件，默认使用 SQLite:
# DATABASE_URL=sqlite:///./quickinstaller.db
```

**运行开发服务器:**
```bash
python main.py
```
*后端集成了 Alembic 自动迁移，启动时会自动检查并升级数据库表结构。*

### 2. 前端配置
确保已安装 Node.js 16+。

```bash
cd client
npm install
```

**运行开发服务器:**
```bash
npm run dev
```

---

## 📑 核心开发指南

### 数据库迁移 (Alembic)
本项目严禁手动删除数据库文件来更新字段。如果需要修改/增加模型字段：
1. 在 `backend/models.py` 中修改类。
2. 生成迁移脚本：`alembic revision --autogenerate -m "描述"`
3. 应用迁移：`alembic upgrade head`
*注意：`main.py` 在启动时会自动执行 `upgrade head`。*

### 接口规范
所有的 API 路径统一由 `main.py` 挂载，并使用 `/api` 前缀。
- 用户权限：通过 `Depends(get_current_user)` 进行角色校验。
- 静态资源：上传的脚本存储于 `backend/uploads` 目录。

### UI & 美学规范
界面追求极致的简约与高对比度：
- **标题样式**: 使用 `.premium-heading` 类（极致加粗 900，深黑色）。
- **表单控件**: 使用 `.form-input` 系列类，确保磨砂玻璃背景下的可读性。
- **头像**: 采用深色首字母。

## 📁 项目结构
- `/backend`: FastAPI 代码、Alembic 配置、uploads 存储。
- `/client`: React 源码及静态资源。
- `/.agents`: 智能助手工作记忆与任务归档。

---
**Maintainer**: Antigravity Assistant
**Status**: V2 Stable (Production Ready)
