# =====================================================================
# 脚本名称: Auto-Install-OpenClaw.ps1
# 核心逻辑: 
#   1. 环境探测：检测 Node.js 及其主版本号 (>=22)
#   2. 环境补全：缺失或版本过低时，自动拉取并静默安装
#   3. 权限放行：修改 PowerShell 执行策略
#   4. 核心注入：执行 OpenClaw 在线安装包
# =====================================================================

$ErrorActionPreference = "Stop"

# ---------------------------------------------------------
# 第一部分：探测与安装 Node.js (要求版本 >= 22)
# ---------------------------------------------------------
Write-Host "[1/4] 正在检测系统 Node.js 环境..." -ForegroundColor Cyan

$needInstallNode = $true

# 检测节点命令是否存在
if (Get-Command node -ErrorAction SilentlyContinue)
{
    # 提取纯数字版本号并获取主版本
    $versionStr = (node -v) -replace '^v', ''
    $majorVersion = [int]($versionStr -split '\.')[0]
    
    if ($majorVersion -ge 22)
    {
        $needInstallNode = $false
        Write-Host "✅ 检测通过：当前 Node.js 版本为 v$versionStr，满足大于等于 22 的要求。" -ForegroundColor Green
    }
    else
    {
        Write-Host "⚠️ 版本过低：当前版本 v$versionStr，低于要求的 v22，准备覆盖安装。" -ForegroundColor Yellow
    }
}
else
{
    Write-Host "⚠️ 未检测到 Node.js 环境，准备执行全新安装。" -ForegroundColor Yellow
}

# 执行自动安装逻辑
if ($needInstallNode)
{
    Write-Host "[2/4] 正在拉取 Node.js 22 LTS 官方安装包..." -ForegroundColor Cyan
    
    # 强制使用 TLS 1.2 保证下载链路连通性
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $NodeUrl = "https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi"
    $TempMsi = "$env:TEMP\node-v22.msi"
    
    # 使用基础解析模式下载文件
    Invoke-WebRequest -Uri $NodeUrl -OutFile $TempMsi -UseBasicParsing
    
    Write-Host "      下载完成，正在静默安装底层引擎 (请稍候)..." -ForegroundColor Cyan
    Start-Process msiexec.exe -ArgumentList "/i `"$TempMsi`" /qn /norestart" -Wait -NoNewWindow
    
    # 清理临时文件
    Remove-Item -Path $TempMsi -Force -ErrorAction SilentlyContinue
    
    # 热重载当前终端的环境变量，使接下来的脚本能识别最新的 Node 路径
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    Write-Host "✅ Node.js 22 安装并配置完毕！" -ForegroundColor Green
}
else
{
    Write-Host "[2/4] Node.js 环境达标，跳过安装步骤。" -ForegroundColor Cyan
}

# ---------------------------------------------------------
# 第二部分：解除执行策略限制与部署 OpenClaw
# ---------------------------------------------------------
Write-Host "[3/4] 正在配置系统脚本执行策略..." -ForegroundColor Cyan

# 按照你提供的步骤，精确放行当前用户和当前进程的脚本执行权限
# 加上 -Force 参数可以跳过系统弹出的 [Y/N] 确认提示，实现真正的全自动
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

Write-Host "✅ 权限策略放行成功。" -ForegroundColor Green

Write-Host "[4/4] 正在通过远端流注入 OpenClaw 核心框架..." -ForegroundColor Cyan

# 按照教程要求，从远端获取 ps1 脚本流并通过 iex (Invoke-Expression) 管道直接在内存中执行
iwr -useb https://openclaw.ai/install.ps1 | iex

Write-Host "🎉 自动化部署流程全部执行完毕！" -ForegroundColor Magenta