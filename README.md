# strapi-plugin-bag

<p align="center">
  <img src="apps/docs/docs/public/logo-min.png" width="120" alt="strapi-plugin-bag Logo">
</p>

<p align="center">
  <strong>一站式 Strapi 5 综合增强解决方案</strong>
</p>

---

## 🏗️ 项目结构

这是一个基于 Turborepo 的 Monorepo 项目：

- **`apps/backend`**: Strapi 5 核心后端应用。
- **`apps/docs`**: 基于 VitePress 的插件使用手册。
- **`packages/strapi-plugin-bag`**: 核心插件源码，包含安全、内容、导航等全套功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发环境

```bash
pnpm dev
```

这会同时启动 Strapi 后端和文档中心。

## ✨ 主要功能

- **安全加固**：IP 访问限制、RSA/AES 加密传输、图形/邮件验证码。
- **内容发布**：完善的文章、分类、标签管理系统。
- **交互系统**：多级评论审核、留言板系统。
- **可视化运营**：菜单导航管理、幻灯片管理、友情链接管理。
- **系统工具**：刷新令牌 (Refresh Token) 管理、升级日志。

## 📖 详细文档

请参阅 `apps/docs` 或访问 [在线手册](https://hangjob.github.io/strapi-plugin-bag/)。

---

MIT License. Copyright © 2025-present **strapi-plugin-bag Team**.
