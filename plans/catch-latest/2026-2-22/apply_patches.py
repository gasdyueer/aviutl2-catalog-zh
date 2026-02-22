#!/usr/bin/env python3
"""
应用补丁脚本 - 将原版的更新应用到汉化版本
保持汉化特性，智能合并补丁
"""

import os
import re
import subprocess
from pathlib import Path

# 配置
PATCH_DIR = Path(__file__).parent
PROJECT_ROOT = PATCH_DIR.parent.parent.parent


def run_command(cmd, cwd=None):
    """运行命令并返回结果"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd or PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=300,
        )
        if result.returncode != 0:
            return None
        return result.stdout.strip()
    except Exception as e:
        print(f"Command error: {e}")
        return None


def parse_patch_file(patch_path):
    """解析补丁文件，提取文件路径"""
    with open(patch_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r"diff --git a/(.+?) b/(.+?)\n", content)
    if match:
        return match.group(2)
    return None


def apply_patch(patch_path):
    """应用单个补丁"""
    filepath = parse_patch_file(patch_path)
    if not filepath:
        return False

    print(f"[{patch_path.name}] -> {filepath}")

    # 尝试使用 git apply
    cmd = f'git apply --3way "{patch_path}"'
    result = run_command(cmd)

    if result is not None:
        print("  [OK] Applied successfully")
        return True
    else:
        # 如果失败，尝试强制应用
        cmd = f'git apply "{patch_path}"'
        result = run_command(cmd)
        if result is not None:
            print("  [OK] Applied with force")
            return True
        else:
            print("  [FAIL] Need manual resolution")
            return False


def main():
    """主函数"""
    print("=" * 60)
    print("AviUtl2-Catalog-ZH Patch Apply Tool")
    print("=" * 60)

    # 切换到项目根目录
    os.chdir(PROJECT_ROOT)

    # 创建备份分支
    print("\nCreating backup branch...")
    run_command("git branch backup-before-2026-2-22")

    # 获取所有补丁文件
    patch_files = sorted(PATCH_DIR.glob("diff__*.patch"))
    print(f"\nFound {len(patch_files)} patch files")

    # 统计
    success_count = 0
    fail_count = 0
    conflict_files = []

    # 应用补丁
    for i, patch_path in enumerate(patch_files, 1):
        print(f"\n[{i}/{len(patch_files)}] ", end="")
        filepath = parse_patch_file(patch_path)

        if apply_patch(patch_path):
            success_count += 1
        else:
            fail_count += 1
            if filepath:
                conflict_files.append(filepath)

    # 输出结果
    print("\n" + "=" * 60)
    print("Patch Application Complete")
    print("=" * 60)
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")

    if conflict_files:
        print("\nFiles needing manual resolution:")
        for f in conflict_files:
            print(f"  - {f}")

        print("\nTips:")
        print("1. Use 'git status' to see conflicted files")
        print("2. Manually edit to resolve conflicts")
        print("3. Use 'git add <file>' to mark as resolved")
        print("4. Commit changes when done")

    print("\nCurrent git status:")
    status = run_command("git status --short")
    if status:
        print(status)


if __name__ == "__main__":
    main()
