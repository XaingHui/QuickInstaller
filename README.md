# 🛠 QuickInstaller - 极客脚本工具箱

**探索、获取并一键部署您的生产力。**

QuickInstaller 是一个专为开发者和运维极客打造的脚本分发与管理平台。它不仅是一个工具仓库，更是一个追求极致简约美学与流畅交互的“黑系”极客空间。

---

## 🌐 即刻访问 (Live Demo)

您可以直接通过以下公网地址体验我们的全网公测版：

### 🚀 [http://47.99.118.54/](http://47.99.118.54/)

---

## ✨ 核心特色

- **极致简约美学**：采用深色极简 UI 设计，辅以珠光灵动背景与顶级微光动效，让工具管理也成为一种享受。
- **一键脚本获取**：无需繁琐搜索，点击即可获取经过审核的优质自动化脚本。
- **开发者社区**：注册并加入我们，分发您的高性能脚本，赋能更多开发者。
- **全栈性能支撑**：基于 FastAPI 异步后端与 Vite 高速前端构建，响应如闪电般迅速。

---

## 📖 用户操作指南

### 1. 探索工具
在首页您可以浏览所有已通过审核的优质脚本。通过顶部的分类标签（AI工具、Python相关等），快速锁定您需要的资源。

### 2. 获取脚本
点击对应的脚本卡片，即可一键下载原始文件或获取在线部署指令。

### 3. 分发您的脚本
1. **注册/登录**：点击右上角加入社区。
2. **上传脚本**：填入脚本标题、描述并上传物理文件。
3. **等待审核**：管理员审核通过后，您的脚本将立即在首页展示，造福全网极客。

---

## 🛡 开发与部署

如果您是开发者，想了解本项目的底层架构或在自己的服务器上部署一套，请参考以下文档：

- [🛠 开发者手册 (README_DEV.md)](./README_DEV.md)
- [🚀 生产环境部署指南 (DEPLOYMENT.md)](./DEPLOYMENT.md)

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
\## 🏗️ 技术架构

```text
┌─────────────────────────────────────────┐
│              Web / Desktop UI            │
│         (React + TailwindCSS)            │
├─────────────────────────────────────────┤
│              REST API Server             │
│           (Node.js / FastAPI)            │
├──────────┬──────────┬───────────────────┤
│ 安装引擎  │ 状态监控  │  包管理器          │
│ (Shell)  │(WebSocket)│ (JSON Registry)   │
└──────────┴──────────┴───────────────────┘
技术栈
前端：
- 原生html
- TailwindCSS
后端：
- Python (FastAPI)
- WebSocket（实时日志推送）
- child_process / subprocess（执行安装脚本）
安装引擎：
- Shell / PowerShell 脚本
- Docker API（可选）
- JSON 工具描述文件
(⬆ 回到顶部)
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9 或 pnpm >= 8
- Git

### 安装

1.  克隆仓库
    
    ```bash
    git clone https://github.com/yourname/ai-toolbox.git
    cd ai-toolbox
    ```
    
2.  安装依赖  
    npm install
3.  启动开发服务器  
    npm run dev
4.  打开浏览器访问  
    http://localhost:3000  
    (⬆ 回到顶部)

```
## 📸 使用说明

<!-- 在此添加项目截图 -->
<!-- ![screenshot](docs/images/screenshot.png) -->

1. 启动后在首页浏览可用的 AI 工具列表
2. 点击工具卡片查看详情和系统要求
3. 点击「安装」按钮，实时查看安装日志
4. 安装完成后可在「已安装」页面管理工具

<p align="right">(<a href="#readme-top">⬆ 回到顶部</a>)</p>
## 🗺️ 开发路线图

- [x] 项目初始化与脚手架搭建
- [ ] 工具描述文件规范（JSON Schema）
- [ ] 基础 Web UI（工具列表 + 安装按钮）
- [ ] 安装引擎核心（Shell 执行 + 日志流）
- [ ] 支持首批工具（OpenClaw、Ollama）
- [ ] 安装进度与实时日志展示
- [ ] 工具状态监控面板
- [ ] 一键更新与卸载
- [ ] 系统环境自动检测
- [ ] Docker 容器化安装支持
- [ ] 桌面客户端（Electron / Tauri）
- [ ] 社区工具市场
- [ ] 多语言支持
    - [ ] English
    - [ ] 中文

> 查看 [open issues](https://github.com/yourname/ai-toolbox/issues) 了解完整的功能提案和已知问题。

<p align="right">(<a href="#readme-top">⬆ 回到顶部</a>)</p>
## 📁 项目结构

```text
ai-toolbox/
├── README.md
├── LICENSE
├── package.json
├── docs/                  # 文档与图片资源
│   └── images/
├── packages/              # 工具描述文件
│   ├── schema.json        # JSON Schema 规范
│   ├── openclaw.json
│   ├── ollama.json
│   └── ...
├── src/
│   ├── web/               # 前端界面
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── server/            # 后端 API
│   │   ├── routes/
│   │   └── index.ts
│   └── engine/            # 安装引擎
│       ├── installer.ts
│       ├── detector.ts
│       └── registry.ts
├── scripts/               # 构建与辅助脚本
└── tests/                 # 测试文件
(⬆ 回到顶部)
```

## 🤝 贡献指南

贡献是开源社区如此美好的原因。非常感谢你的任何贡献！

### 如何贡献

1.  Fork 本项目
2.  创建特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交更改 (`git commit -m 'feat: add some amazing feature'`)
4.  推送分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

### 添加新工具支持

1.  在 `packages/` 目录下创建工具描述文件（参考 `schema.json`）
2.  编写对应平台的安装脚本
3.  测试安装和卸载流程
4.  提交 PR

> 详细贡献规范请参阅 [CONTRIBUTING.md](/C:/Program%20Files/Joplin/resources/app.asar/CONTRIBUTING.md "CONTRIBUTING.md")

([⬆ 回到顶部](#readme-top))

\## 📄 许可证

本项目基于 MIT 许可证分发。详情请参阅 [LICENSE](/C:/Program%20Files/Joplin/resources/app.asar/LICENSE "LICENSE") 文件。

([⬆ 回到顶部](#readme-top))

\## 📬 联系方式

项目作者 - [@XaingHui](https://github.com/XaingHui) 
        - [@null0x0f](https://github.com/null0x0f)
项目链接: https://github.com/XaingHui/QuickInstaller

([⬆ 回到顶部](#readme-top))

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Ollama](https://github.com/ollama/ollama)
- [Open WebUI](https://github.com/open-webui/open-webui)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [Img Shields](https://shields.io)

([⬆ 回到顶部](#readme-top))
=======
---
**Designed with ❤️ by Geek for Geeks.**  
**Current Status**: V2.0 Stable
>>>>>>> 3fdb5bb (添加功能，针对用户上传的脚本，后台进行检查，是否有强制开始utf-8编码，如果没有开启，则服务器自动加入强制开启utf-8编码)
=======
---
**Designed with ❤️ by Geek for Geeks.**  
**Current Status**: V2.0 Stable
=======
\## 🏗️ 技术架构

```text
┌─────────────────────────────────────────┐
│              Web / Desktop UI            │
│         (React + TailwindCSS)            │
├─────────────────────────────────────────┤
│              REST API Server             │
│           (Node.js / FastAPI)            │
├──────────┬──────────┬───────────────────┤
│ 安装引擎  │ 状态监控  │  包管理器          │
│ (Shell)  │(WebSocket)│ (JSON Registry)   │
└──────────┴──────────┴───────────────────┘
技术栈
前端：
- 原生html
- TailwindCSS
后端：
- Python (FastAPI)
- WebSocket（实时日志推送）
- child_process / subprocess（执行安装脚本）
安装引擎：
- Shell / PowerShell 脚本
- Docker API（可选）
- JSON 工具描述文件
(⬆ 回到顶部)
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9 或 pnpm >= 8
- Git

### 安装

1.  克隆仓库
    
    ```bash
    git clone https://github.com/yourname/ai-toolbox.git
    cd ai-toolbox
    ```
    
2.  安装依赖  
    npm install
3.  启动开发服务器  
    npm run dev
4.  打开浏览器访问  
    http://localhost:3000  
    (⬆ 回到顶部)

```
## 📸 使用说明

<!-- 在此添加项目截图 -->
<!-- ![screenshot](docs/images/screenshot.png) -->

1. 启动后在首页浏览可用的 AI 工具列表
2. 点击工具卡片查看详情和系统要求
3. 点击「安装」按钮，实时查看安装日志
4. 安装完成后可在「已安装」页面管理工具

<p align="right">(<a href="#readme-top">⬆ 回到顶部</a>)</p>
## 🗺️ 开发路线图

- [x] 项目初始化与脚手架搭建
- [ ] 工具描述文件规范（JSON Schema）
- [ ] 基础 Web UI（工具列表 + 安装按钮）
- [ ] 安装引擎核心（Shell 执行 + 日志流）
- [ ] 支持首批工具（OpenClaw、Ollama）
- [ ] 安装进度与实时日志展示
- [ ] 工具状态监控面板
- [ ] 一键更新与卸载
- [ ] 系统环境自动检测
- [ ] Docker 容器化安装支持
- [ ] 桌面客户端（Electron / Tauri）
- [ ] 社区工具市场
- [ ] 多语言支持
    - [ ] English
    - [ ] 中文

> 查看 [open issues](https://github.com/yourname/ai-toolbox/issues) 了解完整的功能提案和已知问题。

<p align="right">(<a href="#readme-top">⬆ 回到顶部</a>)</p>
## 📁 项目结构

```text
ai-toolbox/
├── README.md
├── LICENSE
├── package.json
├── docs/                  # 文档与图片资源
│   └── images/
├── packages/              # 工具描述文件
│   ├── schema.json        # JSON Schema 规范
│   ├── openclaw.json
│   ├── ollama.json
│   └── ...
├── src/
│   ├── web/               # 前端界面
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── server/            # 后端 API
│   │   ├── routes/
│   │   └── index.ts
│   └── engine/            # 安装引擎
│       ├── installer.ts
│       ├── detector.ts
│       └── registry.ts
├── scripts/               # 构建与辅助脚本
└── tests/                 # 测试文件
(⬆ 回到顶部)
```

## 🤝 贡献指南

贡献是开源社区如此美好的原因。非常感谢你的任何贡献！

### 如何贡献

1.  Fork 本项目
2.  创建特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交更改 (`git commit -m 'feat: add some amazing feature'`)
4.  推送分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

### 添加新工具支持

1.  在 `packages/` 目录下创建工具描述文件（参考 `schema.json`）
2.  编写对应平台的安装脚本
3.  测试安装和卸载流程
4.  提交 PR

> 详细贡献规范请参阅 [CONTRIBUTING.md](/C:/Program%20Files/Joplin/resources/app.asar/CONTRIBUTING.md "CONTRIBUTING.md")

([⬆ 回到顶部](#readme-top))

\## 📄 许可证

本项目基于 MIT 许可证分发。详情请参阅 [LICENSE](/C:/Program%20Files/Joplin/resources/app.asar/LICENSE "LICENSE") 文件。

([⬆ 回到顶部](#readme-top))

\## 📬 联系方式

项目作者 - [@XaingHui](https://github.com/XaingHui) 
        - [@null0x0f](https://github.com/null0x0f)
项目链接: https://github.com/XaingHui/QuickInstaller

([⬆ 回到顶部](#readme-top))

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Ollama](https://github.com/ollama/ollama)
- [Open WebUI](https://github.com/open-webui/open-webui)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [Img Shields](https://shields.io)

([⬆ 回到顶部](#readme-top))
>>>>>>> 38784b2 (更改readme)
>>>>>>> 406438e (更改readme)
=======
---
**Designed with ❤️ by Geek for Geeks.**  
**Current Status**: V2.0 Stable
>>>>>>> 082ea91 (和main分支同步)
