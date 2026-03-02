<#
.SYNOPSIS
    QuickInstaller - 离线系统脚本执行器规范示例
    环境: Windows PowerShell
    目标: 安装 Claude Dev 环境
#>

# 设置终端输出编码以支持中文
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "QuickInstaller 自动部署引擎 - Claude 环境"

# ================= 工具函数区 =================

function Print-Info ($msg) {
    Write-Host "[*] INFO: $msg" -ForegroundColor Cyan
}

function Print-Success ($msg) {
    Write-Host "[+] SUCCESS: $msg" -ForegroundColor Green
}

function Print-Warning ($msg) {
    Write-Host "[!] WARNING: $msg" -ForegroundColor Yellow
}

function Print-Error ($msg) {
    Write-Host "[-] ERROR: $msg" -ForegroundColor Red
}

function Check-Command ($commandName) {
    $commandResult = Get-Command $commandName -ErrorAction SilentlyContinue
    if ($commandResult) {
        return $true
    }
    return $false
}

# ================= 执行主流程 =================

Clear-Host
Print-Info "==============================================="
Print-Info "      开始自动部署: Claude Development Kit "
Print-Info "==============================================="
Write-Host ""

try {
    # 1. 环境检测: Node.js
    Print-Info "正在检测系统依赖: Node.js..."
    if (Check-Command "node") {
        $nodeVersion = node -v
        Print-Success "已检测到 Node.js，版本为 $nodeVersion"
    } else {
        Print-Warning "未检测到 Node.js，准备自动安装..."
        Print-Info "尝试调用 winget 静默安装 Node.js..."
        # 实际生产中可以执行: winget install -e --id OpenJS.NodeJS
        Write-Host ">>> (此处模拟安装进度，耗时 3 秒) <<<" -ForegroundColor DarkGray
        Start-Sleep -Seconds 3
        Print-Success "Node.js 安装成功 (模拟)"
        
        # 刷新环境变量 (当前进程)
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }

    Write-Host ""
    
    # 2. 环境检测: Git
    Print-Info "正在检测系统依赖: Git..."
    if (Check-Command "git") {
        Print-Success "已检测到 Git"
    } else {
        Print-Warning "未检测到 Git，为了更好地体验 Claude，将一并安装 Git"
        Write-Host ">>> (此处模拟安装进度，耗时 2 秒) <<<" -ForegroundColor DarkGray
        Start-Sleep -Seconds 2
        Print-Success "Git 安装成功 (模拟)"
    }

    Write-Host ""

    # 3. 安装主软件 (即脚本最终目的)
    Print-Info "前置依赖检查通过。开始部署 Claude CLI..."
    Print-Info "正在执行: npm install -g @anthropic-ai/claude-code (模拟演示环境将跳过网络请求)"
    
    Write-Host ">>> 正在拉取包数据 [" -NoNewline
    for ($i = 0; $i -lt 20; $i++) {
        Write-Host "#" -NoNewline -ForegroundColor Green
        Start-Sleep -Milliseconds 150
    }
    Write-Host "] 完成! <<<"
    
    Start-Sleep -Seconds 1
    Print-Success "Claude CLI 安装完成并已加入系统变量！"

} catch {
    Print-Error "部署过程中发生异常: $_"
}

Write-Host ""
Print-Info "==============================================="
Print-Success "   所有操作已完成！您可以直接在此窗口继续操作。 "
Print-Info "==============================================="
Write-Host ""
Write-Host "测试命令提示: 键入 'node -v' 试试吧。" -ForegroundColor DarkGray
Write-Host ""

# 让 PowerShell 窗口交互式留存给用户，不自动关闭
# 注意如果你右键运行此 ps1，在它走完后它会保留控制权
# 由于通过快捷方式启动默认会关闭，我们使用 Read-Host 阻止或者直接切换至交互 shell 模式
try {
    # PowerShell 保活机制 
    # 如果是在独立窗口起的，这里给用户一个 bash like 的 prompt
    while ($true) {
        $cmdInput = Read-Host "QuickInstaller-Terminal PS>"
        if ($cmdInput -eq "exit") { break }
        if ([string]::IsNullOrWhiteSpace($cmdInput)) { continue }
        Invoke-Expression $cmdInput
    }
} catch {
    # 兼容处理
}
