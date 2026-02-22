#!/usr/bin/env python3
"""
清理旧文件并应用剩余补丁
"""

import os
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
PATCH_DIR = Path(__file__).parent

# 需要删除的旧文件（根据补丁概览）
FILES_TO_DELETE = [
    "src/components/DeepLinkHandler.jsx",
    "src/components/TitleBar.jsx",
    "src/pages/Updates.jsx",
    "src/pages/NiconiCommons.jsx",
    "src/pages/Home.jsx",
    "src/components/PackageCard.jsx",
    "src/pages/Settings.jsx",
    "src/components/AppShell.jsx",
    "src/pages/Package.jsx",
    "src/pages/Feedback.jsx",
    "src/pages/InitSetupApp.jsx",
]


def run_command(cmd):
    """运行命令"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=60,
        )
        return result.returncode == 0
    except:
        return False


def main():
    os.chdir(PROJECT_ROOT)

    print("删除旧文件...")
    for filepath in FILES_TO_DELETE:
        full_path = PROJECT_ROOT / filepath
        if full_path.exists():
            print(f"  删除：{filepath}")
            full_path.unlink()
        else:
            print(f"  已不存在：{filepath}")

    print("\n从 git 暂存区移除...")
    for filepath in FILES_TO_DELETE:
        run_command(f'git rm -f "{filepath}" 2>nul')

    print("\n现在手动应用剩余配置文件补丁...")
    print("请检查以下文件是否需要更新：")
    print("  - package.json")
    print("  - src-tauri/Cargo.toml")
    print("  - src-tauri/tauri.conf.json")
    print("  - .env.development")

    print("\n完成！请检查 git status")


if __name__ == "__main__":
    main()
