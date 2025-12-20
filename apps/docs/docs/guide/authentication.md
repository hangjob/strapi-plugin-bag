# 认证模块指南

`strapi-plugin-bag` 提供了一套完整的认证系统，基于 Strapi 内置的 `users-permissions` 插件构建，并增加了 **验证码校验**、**Token 刷新** 以及 **增强注册流程** 等功能。

## 概览

整个认证流程包含以下步骤：

1.  **注册 (Register)**:
    *   **邮箱注册**: 用户请求邮箱验证码 -> 用户携带验证码注册。
    *   **图形验证码注册**: 用户请求图形验证码 -> 用户携带图形验证码注册（适用于无需邮箱验证的场景）。
2.  **登录 (Login)**: 支持账号密码登录，可配置开启验证码（邮箱或图形）双重校验。
3.  **刷新 (Refresh)**: 当 Access Token 过期时，客户端使用 Refresh Token 获取新的 Token。
4.  **退出 (Logout)**: 客户端请求服务器让 Refresh Token 失效。

---

## 全局配置 (Configuration)

你可以通过 `config/plugins.js` 动态控制验证码策略：

```javascript
// config/plugins.js
module.exports = {
  'strapi-plugin-bag': {
    enabled: true,
    config: {
      login: {
        captcha: {
          enabled: false, // 是否开启登录验证码 (默认 false)
          type: 'image'   // 'image' (图形) | 'email' (邮箱) | 'any' (任意)
        }
      },
      register: {
        captcha: {
          enabled: true,  // 是否开启注册验证码 (默认 true)
          type: 'email'   // 'image' (图形) | 'email' (邮箱) | 'any' (任意)
        }
      }
    }
  }
}
```

---

## API 参考

所有插件接口的基础路径为 `/api/strapi-plugin-bag`。

### 1. 获取图形验证码 (Get Image Captcha)

生成 SVG 格式的图形验证码。

**接口地址:** `GET /auth/captcha-image`

**响应:**

```json
{
  "key": "3a5f7d...", // 随机标识符
  "svg": "<svg>...</svg>" // SVG 图片数据
}
```

---

### 2. 发送邮箱验证码 (Send Email Code)

向用户的邮箱发送 6 位数字验证码。

**接口地址:** `POST /auth/send-code`

**请求体:** `{"identifier": "user@example.com"}`

---

### 3. 注册 (Register)

**接口地址:** `POST /auth/register`

如果开启了验证码，支持以下两种模式：

**模式 A: 邮箱验证码**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "Password123",
  "code": "123456"
}
```

**模式 B: 图形验证码**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "Password123",
  "key": "3a5f7d...", // 来自 captcha-image 接口
  "code": "abcd"      // 图形验证码内容
}
```

---

### 4. 登录 (Login)

**接口地址:** `POST /auth/login`

如果配置开启了登录验证码 (`login.captcha.enabled: true`)：

**场景 1: 配合图形验证码防刷**
```json
{
  "identifier": "user@example.com",
  "password": "Password123",
  "key": "3a5f7d...", // 图形验证码 Key
  "code": "abcd"      // 图形验证码内容
}
```

**场景 2: 配合邮箱验证码双重验证**
```json
{
  "identifier": "user@example.com",
  "password": "Password123",
  "code": "123456" // 邮箱验证码
}
```

---

### 5. 刷新 Token (Refresh Token)

用于在 Access Token (JWT) 过期后获取新的 Token，而无需用户重新输入密码。通常建议前端在检测到 401 错误或 Token 即将过期时自动调用。

**接口地址:** `POST /auth/refresh-token`

**请求参数:**

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `refreshToken` | string | 是 | 登录或注册时返回的长期令牌 |

**请求体示例:**

```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**响应成功 (200 OK):**

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsIn..." // 新生成的短期 Access Token
}
```

**响应失败 (400 Bad Request):**
*   `Missing refresh token`: 未传参数
*   `Invalid refresh token`: Token 不存在或格式错误
*   `Refresh token expired`: Token 已过期（需重新登录）

---

### 6. 获取当前用户 (Me)

获取当前已登录用户的详细个人资料。此接口需要鉴权。

**接口地址:** `GET /auth/me`

**请求头 (Headers):**

| Header | Value | 描述 |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <your_jwt_token>` | 必须携带有效的 Access Token |

**响应成功 (200 OK):**

```json
{
  "id": 1,
  "username": "newuser",
  "email": "user@example.com",
  "provider": "local",
  "confirmed": true,
  "blocked": false,
  "createdAt": "2023-10-01T10:00:00.000Z",
  "updatedAt": "2023-10-01T10:00:00.000Z"
  // ... 其他自定义用户字段
}
```

**响应失败 (401 Unauthorized):**
*   Token 无效或缺失。

---

### 7. 退出登录 (Logout)

在服务器端销毁指定的 Refresh Token，使其无法再用于刷新 Access Token。虽然 Access Token (JWT) 本身在过期前依然有效（无状态特性），但此操作能确保长期会话被终止。

**接口地址:** `POST /auth/logout`

**请求参数:**

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `refreshToken` | string | 是 | 需要注销的 Refresh Token |

**请求体示例:**

```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**响应成功 (200 OK):**

```json
{
  "message": "退出登录成功"
}
```

**客户端最佳实践:**
调用此接口成功后，前端应同时清除本地存储（localStorage/Cookie）中的 `jwt` 和 `refreshToken`。
