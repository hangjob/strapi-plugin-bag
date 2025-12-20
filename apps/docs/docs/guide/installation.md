# 安装指南

本章节将引导您如何在现有的 Strapi 5 项目中安装并启用 `strapi-plugin-bag`。

## 环境要求

在开始之前，请确保您的开发环境满足以下要求：

- **Strapi 版本**: `^5.0.0` (支持最新的 Strapi 5 架构)
- **Node.js 版本**: `>=22.10.0`
- **数据库**: MySQL, PostgreSQL 或 SQLite

## 安装步骤

您可以使用您喜欢的包管理器将插件添加到您的 Strapi 项目中。

::: code-group

```bash [pnpm]
pnpm add strapi-plugin-bag
```

```bash [npm]
npm install strapi-plugin-bag
```

```bash [yarn]
yarn add strapi-plugin-bag
```

:::

## 启用插件

安装完成后，您需要手动在 Strapi 的配置文件中启用该插件。

编辑或创建项目根目录下的 `config/plugins.js` (或 `config/plugins.ts`) 文件：

```javascript
module.exports = ({ env }) => ({
  // ... 其他插件配置
  "strapi-plugin-bag": {
    enabled: true,
  },
});
```

## 重新构建

为了让插件的后台管理界面生效，您需要重新构建 Strapi 的管理面板并重启服务：

```bash
# 构建管理面板
npm run build

# 启动开发服务器
npm run dev
```

## 权限配置

启用插件后，您需要为相应的角色配置 API 访问权限：

1. 登录 Strapi 管理后台。
2. 前往 **Settings (设置)** -> **Users & Permissions Plugin** -> **Roles (角色)**。
3. 选择您想要配置的角色（如 `Public` 或 `Authenticated`）。
4. 在 **Permissions (权限)** 列表中找到 **Strapi-plugin-bag**。
5. 勾选您需要开放的 API 权限（如 `article.find`, `menu.findOne` 等）。
6. 点击右上角的 **Save (保存)**。

![权限配置示例](/screenshots/permissions.png)

---

祝贺您！现在您已经成功安装并配置了 `strapi-plugin-bag`。您可以开始在左侧菜单栏中探索它的各项强大功能了。
