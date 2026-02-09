# AviUtl2 カタログ Windows 安装程序构建脚本
# 版本: 1.0.0
# 描述: 自动化构建 AviUtl2 カタログ Windows 安装程序

param(
    [switch]$Clean = $false,
    [switch]$Dev = $false,
    [switch]$SkipDeps = $false,
    [switch]$Verbose = $false,
    [string]$OutputDir = ""
)

# 设置错误处理
$ErrorActionPreference = "Stop"

# 颜色定义
$ColorGreen = "Green"
$ColorYellow = "Yellow"
$ColorRed = "Red"
$ColorCyan = "Cyan"
$ColorGray = "Gray"

# 日志函数
function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "White",
        [string]$Level = "INFO"
    )
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$Timestamp] [$Level] $Message" -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Log -Message $Message -Color $ColorGreen -Level "SUCCESS"
}

function Write-Info {
    param([string]$Message)
    Write-Log -Message $Message -Color $ColorCyan -Level "INFO"
}

function Write-Warning {
    param([string]$Message)
    Write-Log -Message $Message -Color $ColorYellow -Level "WARNING"
}

function Write-Error {
    param([string]$Message)
    Write-Log -Message $Message -Color $ColorRed -Level "ERROR"
    throw $Message
}

# 环境检查函数
function Test-Environment {
    Write-Info "检查构建环境..."
    
    # 检查 Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js 版本: $nodeVersion"
    } catch {
        Write-Error "Node.js 未安装或未在 PATH 中。请安装 Node.js 18+。"
    }
    
    # 检查 npm
    try {
        $npmVersion = npm --version
        Write-Success "npm 版本: $npmVersion"
    } catch {
        Write-Error "npm 未安装或未在 PATH 中。"
    }
    
    # 检查 Rust
    try {
        $rustVersion = rustc --version
        Write-Success "Rust 版本: $rustVersion"
    } catch {
        Write-Warning "Rust 未安装或未在 PATH 中。构建可能会失败。"
    }
    
    # 检查 cargo
    try {
        $cargoVersion = cargo --version
        Write-Success "Cargo 版本: $cargoVersion"
    } catch {
        Write-Warning "Cargo 未安装。Rust 构建将失败。"
    }
    
    # 检查 Tauri CLI
    try {
        $tauriVersion = npx tauri --version
        Write-Success "Tauri CLI 版本: $tauriVersion"
    } catch {
        Write-Info "Tauri CLI 将通过 npm 脚本使用。"
    }
    
    # 检查磁盘空间
    $drive = Get-PSDrive -Name (Get-Location).Drive.Name
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    if ($freeGB -lt 5) {
        Write-Warning "磁盘空间不足: ${freeGB}GB (建议至少 5GB)"
    } else {
        Write-Success "可用磁盘空间: ${freeGB}GB"
    }
    
    Write-Success "环境检查完成"
}

# 安装依赖函数
function Install-Dependencies {
    Write-Info "安装项目依赖..."
    
    # 安装 Node.js 依赖
    Write-Info "安装 Node.js 依赖..."
    try {
        if ($Verbose) {
            npm ci
        } else {
            npm ci --silent
        }
        Write-Success "Node.js 依赖安装完成"
    } catch {
        Write-Warning "npm ci 失败，尝试 npm install..."
        if ($Verbose) {
            npm install
        } else {
            npm install --silent
        }
        Write-Success "Node.js 依赖安装完成"
    }
    
    # 检查 Rust 依赖（通过 cargo 构建时会自动下载）
    Write-Info "Rust 依赖将在构建时自动下载..."
}

# 清理函数
function Clean-Build {
    Write-Info "清理旧构建产物..."
    
    $pathsToClean = @(
        "dist",
        "src-tauri\target",
        "src-tauri\Cargo.lock"
    )
    
    foreach ($path in $pathsToClean) {
        if (Test-Path $path) {
            try {
                Remove-Item -Recurse -Force $path -ErrorAction Stop
                Write-Info "已清理: $path"
            } catch {
                Write-Warning "无法清理 $path: $_"
            }
        }
    }
    
    Write-Success "清理完成"
}

# 构建函数
function Build-Application {
    Write-Info "开始构建 AviUtl2 カタログ..."
    
    # 构建命令
    $buildCommand = "npm run tauri:build"
    
    Write-Info "执行构建命令: $buildCommand"
    
    # 设置环境变量以优化构建
    $env:CARGO_INCREMENTAL = "1"
    $env:NODE_OPTIONS = "--max-old-space-size=4096"
    
    # 执行构建
    try {
        if ($Verbose) {
            Invoke-Expression $buildCommand
        } else {
            $null = Invoke-Expression $buildCommand 2>&1 | Out-Host
        }
        
        Write-Success "构建完成"
    } catch {
        Write-Error "构建失败: $_"
    }
}

# 验证构建结果
function Test-BuildResult {
    Write-Info "验证构建结果..."
    
    # 查找安装程序
    $installerPattern = "src-tauri\target\release\bundle\nsis\AviUtl2_Catalog_*.exe"
    $installers = Get-ChildItem -Path $installerPattern -ErrorAction SilentlyContinue
    
    if ($installers.Count -eq 0) {
        # 尝试其他可能的位置
        $installerPattern = "src-tauri\target\**\bundle\nsis\*.exe"
        $installers = Get-ChildItem -Path $installerPattern -ErrorAction SilentlyContinue
    }
    
    if ($installers.Count -gt 0) {
        foreach ($installer in $installers) {
            $fileSizeMB = [math]::Round($installer.Length / 1MB, 2)
            Write-Success "找到安装程序: $($installer.Name)"
            Write-Info "  路径: $($installer.FullName)"
            Write-Info "  大小: ${fileSizeMB}MB"
            Write-Info "  修改时间: $($installer.LastWriteTime)"
            
            # 复制到输出目录（如果指定）
            if ($OutputDir -ne "") {
                if (-not (Test-Path $OutputDir)) {
                    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
                }
                $destPath = Join-Path $OutputDir $installer.Name
                Copy-Item $installer.FullName $destPath -Force
                Write-Success "已复制到: $destPath"
            }
        }
        
        # 检查主可执行文件
        $exePath = "src-tauri\target\release\aviutl2-catalog.exe"
        if (Test-Path $exePath) {
            $exeSizeMB = [math]::Round((Get-Item $exePath).Length / 1MB, 2)
            Write-Success "找到主可执行文件: aviutl2-catalog.exe (${exeSizeMB}MB)"
        }
        
        return $true
    } else {
        Write-Error "未找到安装程序文件。构建可能失败。"
        return $false
    }
}

# 开发模式
function Start-DevMode {
    Write-Info "启动开发模式..."
    Write-Info "按 Ctrl+C 停止开发服务器"
    
    try {
        npm run tauri:dev
    } catch {
        Write-Error "开发模式启动失败: $_"
    }
}

# 主函数
function Main {
    Write-Host "=========================================" -ForegroundColor $ColorCyan
    Write-Host "  AviUtl2 カタログ Windows 构建脚本     " -ForegroundColor $ColorCyan
    Write-Host "=========================================" -ForegroundColor $ColorCyan
    Write-Host ""
    
    # 记录开始时间
    $startTime = Get-Date
    
    try {
        # 清理选项
        if ($Clean) {
            Clean-Build
        }
        
        # 环境检查（除非跳过）
        if (-not $SkipDeps) {
            Test-Environment
        }
        
        # 开发模式
        if ($Dev) {
            Start-DevMode
            return
        }
        
        # 安装依赖（除非跳过）
        if (-not $SkipDeps) {
            Install-Dependencies
        }
        
        # 构建应用
        Build-Application
        
        # 验证构建结果
        $buildSuccess = Test-BuildResult
        
        if ($buildSuccess) {
            # 计算构建时间
            $endTime = Get-Date
            $duration = $endTime - $startTime
            $minutes = [math]::Floor($duration.TotalMinutes)
            $seconds = [math]::Round($duration.Seconds)
            
            Write-Host ""
            Write-Host "=========================================" -ForegroundColor $ColorGreen
            Write-Host "  构建成功完成！                        " -ForegroundColor $ColorGreen
            Write-Host "  总耗时: ${minutes}分${seconds}秒      " -ForegroundColor $ColorGreen
            Write-Host "=========================================" -ForegroundColor $ColorGreen
            Write-Host ""
            Write-Info "下一步操作:"
            Write-Info "1. 测试安装程序功能"
            Write-Info "2. 发布到 GitHub Releases"
            Write-Info "3. 提交到 Winget 仓库"
            Write-Info "4. 分发给用户测试"
        }
        
    } catch {
        Write-Host ""
        Write-Host "=========================================" -ForegroundColor $ColorRed
        Write-Host "  构建失败！                            " -ForegroundColor $ColorRed
        Write-Host "  错误: $_" -ForegroundColor $ColorRed
        Write-Host "=========================================" -ForegroundColor $ColorRed
        Write-Host ""
        Write-Info "故障排除建议:"
        Write-Info "1. 确保所有必需软件已安装 (Node.js, Rust, Visual C++, NSIS)"
        Write-Info "2. 检查网络连接"
        Write-Info "3. 尝试清理后重新构建: .\build.ps1 -Clean"
        Write-Info "4. 查看详细日志: .\build.ps1 -Verbose"
        exit 1
    }
}

# 执行主函数
