# IP 访问限制

本插件提供了基于中间件的 IP 访问限制功能，允许开发者通过配置白名单或黑名单来控制对 API 的访问权限。

## 功能特性

- **黑白名单支持**：同时支持配置允许访问的 IP（白名单）和禁止访问的 IP（黑名单）。
- **优先级策略**：黑名单优先级高于白名单。
- **全局生效**：默认应用到插件提供的所有 Content API 路由。

## 配置说明

配置位于 Strapi 项目的 `config/plugins.js` 文件中。

### 启用与配置

在 `config/plugins.js` 中添加以下配置：

```javascript
module.exports = ({ env }) => ({
  'strapi-plugin-bag': {
    config: {
      ipRestriction: {
        enabled: true,            // 开启 IP 限制功能
        whitelist: ['127.0.0.1'], // 白名单：仅允许这些 IP 访问
        blacklist: [],            // 黑名单：禁止这些 IP 访问
      },
    },
  },
});
```

### 参数详解

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `false` | 是否开启 IP 限制功能。关闭时所有请求直接放行。 |
| `whitelist` | `string[]` | `[]` | 白名单 IP 列表。如果不为空，则**不在**列表中的 IP 将被拒绝。 |
| `blacklist` | `string[]` | `[]` | 黑名单 IP 列表。**在**列表中的 IP 将被拒绝。 |

## 逻辑规则

请求处理流程如下：

1.  **开关检查**：如果 `enabled` 为 `false`，则不进行 IP 检查，直接允许访问。
2.  **黑名单检查**：如果请求 IP 存在于 `blacklist` 中，拒绝访问 (返回 403 Forbidden)。
3.  **白名单检查**：如果 `whitelist` 不为空，且请求 IP **不在** `whitelist` 中，拒绝访问 (返回 403 Forbidden)。
4.  **默认通过**：如果白名单为空，且 IP 不在黑名单中，则允许访问。

::: tip 注意
黑名单的优先级高于白名单。即使一个 IP 同时存在于白名单和黑名单中，它也会被拒绝访问。
:::

## 适用路由

该功能默认应用于 `strapi-plugin-bag` 提供的所有前端 API (Content API) 路由，包括但不限于：

- 登录 (`/auth/login`)
- 注册 (`/auth/register`)
- 刷新 Token (`/auth/refresh-token`)
- 获取验证码 (`/auth/captcha-image`, `/auth/send-code`)
- 加密工具 API (`/utils/rsa/*`, `/utils/aes/*`)

::: warning
该限制目前仅针对本插件提供的路由生效，不会影响 Strapi 原生路由或其他插件的路由。
:::

