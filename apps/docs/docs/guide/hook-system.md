# 插件事件钩子 (Hook System)

在高级业务场景中，您可能希望在特定的内容变更时触发自定义逻辑。例如：

- 当用户在“留言板”提交新信息时，自动发送一封邮件通知管理员。
- 当“文章”发布时，自动清理前端 CDN 缓存或更新搜索索引。
- 在“评论”存入数据库前，调用第三方 API 进行敏感词过滤。

Strapi 5 提供了强大的 **生命周期钩子 (Lifecycles)** 和 **事件系统** 来实现这些功能。

## 1. 内容生命周期钩子 (Lifecycles)

生命周期钩子允许您在模型执行 CRUD 操作的特定阶段注入代码。

### 常见的钩子阶段：

- `beforeCreate` / `afterCreate`
- `beforeUpdate` / `afterUpdate`
- `beforeDelete` / `afterDelete`

### 如何在插件中注册

由于 `Bag Plugin` 的模型定义在插件内部，您可以在插件的 `server/src/bootstrap.js` 中全局订阅这些事件。

```javascript
// server/src/bootstrap.js
export default ({ strapi }) => {
  // 订阅所有模型的生命周期事件
  strapi.db.lifecycles.subscribe({
    // 指定监听的模型 UID
    models: ["plugin::strapi-plugin-bag.message"],

    async afterCreate(event) {
      const { result, params } = event;

      // 示例：当有新留言时，打印日志或触发通知
      console.log("收到新留言:", result.title);

      // 您可以调用 Strapi 的邮件服务
      // await strapi.plugin('email').service('email').send({ ... });
    },
  });

  strapi.db.lifecycles.subscribe({
    models: ["plugin::strapi-plugin-bag.article"],

    async beforeCreate(event) {
      const { data } = event.params;

      // 示例：如果用户没写摘要，自动截取正文前 100 字
      if (!data.summary && data.content) {
        data.summary = data.content.substring(0, 100) + "...";
      }
    },
  });
};
```

## 2. 使用数据库查询钩子

如果您只想在特定的查询动作中执行逻辑，也可以直接在 Service 层进行拦截，但生命周期钩子是更通用的“一劳永逸”方案，因为它能捕获到来自 Admin 后台、API 调用以及脚本执行的所有变更。

## 3. 实现 Webhooks 通知

如果您希望将事件发送到外部系统（如钉钉机器人、GitHub Actions），可以结合 `axios` 或 `fetch` 在 `afterCreate` 或 `afterUpdate` 钩子中发起请求。

```javascript
// 示例：同步到外部搜索索引
async afterUpdate(event) {
  const { result } = event;
  if (result.publishedAt) {
    await axios.post('https://your-search-api.com/update', {
      id: result.id,
      title: result.title,
      content: result.content
    });
  }
}
```

## 4. 注意事项

1.  **异步处理**：虽然钩子支持 `async/await`，但请注意，如果钩子执行时间过长，会拖慢 API 的响应速度。对于耗时任务（如发送邮件、同步大数据），建议将其放入异步队列中。
2.  **无限递归**：在 `afterUpdate` 钩子中再次调用 `update` 方法会导致死循环。如果必须更新当前数据，请使用 `beforeUpdate` 修改 `event.params.data`，或者在调用时传入特殊的 flag 来跳过钩子。
3.  **UID 格式**：插件模型的 UID 格式通常为 `plugin::插件名.模型名`。

> [!TIP]
> 更多关于生命周期的详细参数和进阶用法，可以查阅 [Strapi 官方文档 - Lifecycles](https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#lifecycles)。
