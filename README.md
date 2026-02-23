# AviUtl2 目录 - 中文汉化版

![Platform](https://img.shields.io/badge/Windows-Only-0078D6)
[![Release](https://img.shields.io/github/v/release/gasdyueer/aviutl2-catalog-zh)](https://github.com/gasdyueer/aviutl2-catalog-zh/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/gasdyueer/aviutl2-catalog-zh/total)](https://github.com/gasdyueer/aviutl2-catalog-zh/releases/latest)
[![License](https://img.shields.io/github/license/gasdyueer/aviutl2-catalog-zh)](https://github.com/gasdyueer/aviutl2-catalog-zh/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/gasdyueer/aviutl2-catalog-zh)](https://github.com/gasdyueer/aviutl2-catalog-zh/commits/main)
![汉化状态](https://img.shields.io/badge/汉化-进行中-yellow)

这是 AviUtl2 目录管理工具的中文汉化版本，基于原项目 [Neosku/aviutl2-catalog](https://github.com/Neosku/aviutl2-catalog)。

**注意**：本汉化版本仅提供中文界面支持，不维护原项目的自动化构建、Winget发布等流程。

目前处于测试版。

---

## 主要功能

- 🚀 轻松安装 AviUtl2 本体及推荐插件
- 📦 一键操作安装、更新、删除（支持批量更新）
- 🔔 当 AviUtl2 本体或插件/脚本有更新时，会在 AviUtl2 的菜单栏中通知
- 🔍 搜索和筛选包
- 📋 批量复制 NicoNico Commons ID
- 🧩 自动检测已安装的包（使用 XXH3-128 哈希）
- 📨 包注册（审核后将在目录中发布）

---

## 支持的下载源

目前支持以下下载源：

- 直接下载 URL
- GitHub Releases
- Google Drive
- BOOTH

---

## 软件界面预览

<table>
  <tr>
    <td><img src="./docs/info1.png"><br>主界面</td>
    <td><img src="./docs/info2.png"><br>包详情</td>
  </tr>
  <tr>
    <td><img src="./docs/info3.png"><br>更新中心</td>
    <td><img src="./docs/info4.png"><br>包注册</td>
  </tr>
</table>

---

## 设置流程预览

<table>
  <tr>
    <td><img src="./docs/setup1.png"><br>设置向导 - 开始</td>
    <td><img src="./docs/setup2.png"><br>设置向导 - 安装状态</td>
  </tr>
  <tr>
    <td><img src="./docs/setup3.png"><br>设置向导 - 安装详情</td>
    <td><img src="./docs/setup4.png"><br>设置向导 - 完成</td>
  </tr>
</table>

---

## 界面构成

- **主界面**：包列表、搜索、筛选、排序
- **包详情界面**：包的详细信息、安装/更新/删除按钮
- **更新中心**：显示可更新的包，支持批量更新
- **设置界面**：应用程序设置、数据管理
- **反馈界面**：错误报告、功能请求
- **包注册界面**：向目录注册新包

---

## 目录数据

目录数据托管在 GitHub 上，通过 JSON 格式提供。
应用程序启动时会从远程获取最新数据，并缓存到本地。

数据格式示例：
```json
{
  "packages": [
    {
      "id": "example-plugin",
      "name": "示例插件",
      "author": "作者名",
      "summary": "这是一个示例插件",
      "type": "plugin",
      "tags": ["效果", "滤镜"],
      "latest-version": "1.0.0",
      "updatedAt": 1700000000000,
      "installer": {
        "install": [
          { "action": "download", "source": { "direct": "https://example.com/plugin.zip" } },
          { "action": "extract", "from": "{download}", "to": "{pluginsDir}" }
        ],
        "uninstall": [
          { "action": "delete", "path": "{pluginsDir}/example-plugin.aui2" }
        ]
      }
    }
  ]
}
```

---

## Deep Link（应用程序启动链接）

支持通过 `aviutl2catalog://` 协议启动应用程序并执行特定操作。

示例：
- `aviutl2catalog://open/package/example-plugin` - 打开指定包的详情页
- `aviutl2catalog://open/updates` - 打开更新中心
- `aviutl2catalog://open/feedback` - 打开反馈页面

---

## 安装方法

### 手动安装（推荐）

1. 从 [本仓库的 Releases 页面](https://github.com/gasdyueer/aviutl2-catalog-zh/releases/latest) 下载最新版本的 `AviUtl2-Catalog-Setup.exe`
2. 运行安装程序并按照提示完成安装

**注意**：本汉化版本不提供 Winget 安装方式，仅支持通过 setup 文件手动安装。


---

## 更新

应用程序会自动检查更新，并在有可用更新时通知您。
您也可以在设置中手动检查更新。

---

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 贡献

欢迎提交汉化改进、翻译修正等相关贡献！

由于这是汉化分支，主要接受以下类型的贡献：
- 界面文本汉化改进
- 文档翻译修正
- 中文使用问题反馈

如需贡献原项目功能，请前往 [原项目仓库](https://github.com/Neosku/aviutl2-catalog)。

---

## 技术栈

- **前端**：React + TypeScript + Tailwind CSS
- **后端**：Tauri (Rust)
- **构建工具**：Vite
- **包管理**：npm / Cargo

---

## 开发环境设置

1. 克隆仓库：
   ```bash
   git clone https://github.com/gasdyueer/aviutl2-catalog-zh.git
   cd aviutl2-catalog-zh
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run tauri dev
   ```

4. 构建应用程序：
   ```bash
   npm run tauri build
   ```

**注意**：本仓库已禁用 GitHub Actions 工作流，构建需在本地进行。

---

## 故障排除

### 常见问题

1. **应用程序无法启动**
   - 确保已安装最新的 Visual C++ Redistributable
   - 检查防病毒软件是否阻止了应用程序

2. **无法下载包**
   - 检查网络连接
   - 确保下载源可用

3. **安装失败**
   - 确保 AviUtl2 已关闭
   - 检查是否有足够的磁盘空间和权限

### 获取帮助

如果您遇到问题，请：
1. 查看 [本仓库的 Issues 页面](https://github.com/gasdyueer/aviutl2-catalog-zh/issues)
2. 在反馈页面提交问题报告
3. 联系开发者

---

## 致谢

- 感谢原项目 [Neosku/aviutl2-catalog](https://github.com/Neosku/aviutl2-catalog) 提供优秀的基础
- 感谢所有为汉化工作做出贡献的开发者
- 特别感谢 AviUtl2 社区提供的宝贵反馈和建议
