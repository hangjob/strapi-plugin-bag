# 自定义 API 响应格式

在构建商业项目时，前端团队通常要求后端提供统一的响应结构（例如包含 `code`、`data`、`message` 等字段），以便于进行全局的异常处理和数据解析。

Strapi 5 默认返回的是符合 REST 或 JSON:API 规范的结构。如果您需要自定义这些响应格式，可以通过 **中间件 (Middlewares)** 全局拦截并转换。

## 1. 定义统一响应中间件

在插件或应用中，您可以创建一个中间件来包装所有 API 的输出。

### 创建中间件文件

在插件的 `server/src/middlewares/` 目录下创建 `response-handler.js`：

```javascript
// server/src/middlewares/response-handler.js
export default (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // 只处理 /api 开头的请求，且排除管理后台请求
    if (ctx.url.startsWith("/api") && ctx.body) {
      // 成功响应的统一封装
      ctx.body = {
        code: ctx.status >= 200 && ctx.status < 300 ? 200 : ctx.status,
        data: ctx.body.data || ctx.body, // 如果 Strapi 已经包装了 data，则取其内部
        message: "success",
        meta: ctx.body.meta || {},
        timestamp: new Date().getTime(),
      };
    }
  };
};
```

## 2. 注册并使用中间件

### 在插件中注册

在 `server/src/middlewares/index.js` 中导出：

```javascript
import responseHandler from "./response-handler";

export default {
  "response-handler": responseHandler,
};
```

### 在路由中启用

在插件的路由配置 `server/src/routes/content-api.js` 中，为您想要统一格式的路由添加该中间件：

```javascript
// server/src/routes/content-api.js
export default [
  {
    method: "GET",
    path: "/articles",
    handler: "article.find",
    config: {
      middlewares: ["plugin::strapi-plugin-bag.response-handler"],
    },
  },
  // ... 其他路由
];
```

## 3. 全局错误处理

除了成功响应，您可能还需要自定义错误响应格式。可以通过在中间件中使用 `try...catch` 来捕获异常并返回自定义 JSON。

```javascript
export default (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
      // ... 成功处理逻辑
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = {
        code: ctx.status,
        data: null,
        message: err.message || "Internal Server Error",
        error: err.details || {},
      };
    }
  };
};
```

## 4. 使用 Policies 进行权限过滤响应

有时候您不希望改变整体格式，而只是想根据权限过滤某些敏感字段。这时可以使用 **Policies**。

```javascript
// server/src/policies/is-admin.js
export default (policyContext, config, { strapi }) => {
  if (
    policyContext.state.user &&
    policyContext.state.user.role.type === "admin"
  ) {
    return true;
  }

  return false;
};
```

## 5. 最佳实践建议

1.  **保持一致性**：一旦决定使用自定义格式，应确保所有对外 API 都遵循该规范。
2.  **保留 Meta 信息**：Strapi 原生的分页信息存放在 `meta` 中，在包装时不要将其丢失。
3.  **开发与生产差异**：在开发环境下，错误响应可以包含更详细的 `stack` 信息，而在生产环境应予以隐藏。

> [!IMPORTANT]
> 修改中间件后，如果是在开发模式下，Strapi 会自动重启。如果是生产环境，请重新运行 `npm run build`。
