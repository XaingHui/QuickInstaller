<div align="center">  

# AI ToolBox

**一键部署和管理主流 AI 工具的统一平台**

告别繁琐的环境配置，让每个人都能轻松用上 AI

[![Stars](https://img.shields.io/github/stars/XaingHui/QuickInstaller?style=for-the-badge)](https://github.com/XaingHui/QuickInstaller/stargazers)
[![Issues](https://img.shields.io/github/issues/XaingHui/QuickInstaller?style=for-the-badge)](https://github.com/XaingHui/QuickInstaller/issues)
[![License](https://img.shields.io/github/license/XaingHui/QuickInstaller?style=for-the-badge)](https://github.com/XaingHui/QuickInstaller/blob/main/LICENSE)</div>

## 📋 目录

- [项目简介](#-%E9%A1%B9%E7%9B%AE%E7%AE%80%E4%BB%8B)
- [功能特性](#-%E5%8A%9F%E8%83%BD%E7%89%B9%E6%80%A7)
- [支持工具](#-%E6%94%AF%E6%8C%81%E5%B7%A5%E5%85%B7)
- [技术架构](#-%E6%8A%80%E6%9C%AF%E6%9E%B6%E6%9E%84)
- [快速开始](#-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
- [使用说明](#-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
- [开发路线图](#-%E5%BC%80%E5%8F%91%E8%B7%AF%E7%BA%BF%E5%9B%BE)
- [贡献指南](#-%E8%B4%A1%E7%8C%AE%E6%8C%87%E5%8D%97)
- [许可证](#-%E8%AE%B8%E5%8F%AF%E8%AF%81)
- [联系方式](#-%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F)
- [致谢](#-%E8%87%B4%E8%B0%A2)

## 🔍 项目简介

目前安装各类 AI 工具（OpenClaw、Ollama、Stable Diffusion 等）需要：

- 手动配置运行环境（Python、Node.js、CUDA...）
- 处理复杂的依赖关系和版本冲突
- 阅读不同项目的安装文档
- 排查各种平台兼容性问题

**AI ToolBox** 将这些步骤封装为统一的一键操作，提供可视化界面，让技术小白也能轻松部署 AI 工具。

> 💡 类似于 Homebrew 之于 macOS 命令行工具，AI ToolBox 之于 AI 应用。

([⬆ 回到顶部](#readme-top))

\## ✨ 功能特性

| 功能  | 描述  | 状态  |
| --- | --- | --- |
| 🖱️ 一键安装 | 选择工具，点击即装，自动处理依赖 | 🚧 开发中 |
| 📊 状态监控 | 实时查看工具运行状态、资源占用 | 📋 计划中 |
| 🔄 一键更新 | 检测新版本，一键升级 | 📋 计划中 |
| 🗑️ 干净卸载 | 完整移除工具及其依赖 | 📋 计划中 |
| 🔍 环境检测 | 自动检测系统环境，推荐可用工具 | 📋 计划中 |
| 🐳 Docker 支持 | 支持容器化安装，环境隔离 | 📋 计划中 |
| 🌐 多平台 | 支持 Windows / macOS / Linux | 🚧 开发中 |

([⬆ 回到顶部](#readme-top))

\## 📦 支持工具

|     |     |     |     |
| :---: | :---: | :---: | :---: |
| <img src="/C:/Program%20Files/Joplin/resources/app.asar/docs/images/openclaw.png" width="60" class="jop-noMdConv">  <br>**OpenClaw**  <br>个人 AI 助手 | <img src="/C:/Program%20Files/Joplin/resources/app.asar/docs/images/antigravity.png" width="60" class="jop-noMdConv">  <br>**Antigravity**  <br>AI 开发框架 | <img src="/C:/Program%20Files/Joplin/resources/app.asar/docs/images/ollama.png" width="60" class="jop-noMdConv">  <br>**Ollama**  <br>本地大模型 | <img src="/C:/Program%20Files/Joplin/resources/app.asar/docs/images/openwebui.png" width="60" class="jop-noMdConv">  <br>**Open WebUI**  <br>对话界面 |
| <img src="/C:/Program%20Files/Joplin/resources/app.asar/docs/images/sd.png" width="60" class="jop-noMdConv">  <br>**SD WebUI**  <br>AI 绘图 | <img src="/C:/Program%20Files/Joplin/resources/app.asar/docs/images/comfyui.png" width="60" class="jop-noMdConv">  <br>**ComfyUI**  <br>节点工作流 | <img src="/C:/Program%20Files/Joplin/resources/app.asar/docs/images/more.png" width="60" class="jop-noMdConv">  <br>**更多...**  <br>持续添加中 |     |

([⬆ 回到顶部](#readme-top))

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
- React / Vue 3
- TailwindCSS
- Vite
后端：
- Node.js (Express) 或 Python (FastAPI)
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

项目作者 - [@yourname](https://github.com/yourname)

项目链接: https://github.com/yourname/ai-toolbox

([⬆ 回到顶部](#readme-top))

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw)
- [Ollama](https://github.com/ollama/ollama)
- [Open WebUI](https://github.com/open-webui/open-webui)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [Img Shields](https://shields.io)

([⬆ 回到顶部](#readme-top))