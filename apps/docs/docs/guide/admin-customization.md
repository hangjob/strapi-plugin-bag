# 后台扩展与页面开发指南

本章节将向开发者介绍如何基于 `strapi-plugin-bag` 扩展 Strapi 的管理后台菜单以及如何开发自定义管理页面。

## 1. 扩展管理后台菜单

Strapi 5 允许插件在 `register` 生命周期中注册侧边栏菜单项。

### 注册菜单入口

在 `admin/src/index.js` 中，我们通过 `app.addMenuLink` 方法添加链接：

```javascript
// admin/src/index.js
import { PluginIcon } from "./components/PluginIcon";
import { PLUGIN_ID } from "./pluginId";

export default {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`, // 路由路径
      icon: PluginIcon, // 菜单图标组件
      intlLabel: {
        // 国际化标签
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: "Bag 插件",
      },
      Component: async () => {
        // 页面组件入口
        const { App } = await import("./pages/App");
        return App;
      },
    });
  },
};
```

## 2. 自定义页面开发

所有的管理后台页面都应当放在 `admin/src/pages/` 目录下，并使用 **Strapi Design System (v2)** 进行构建。

### 页面组件结构

推荐使用 `Layout` 组件来保持与 Strapi 原生界面的一致性。

```jsx
// admin/src/pages/MyCustomPage.jsx
import { Box, Flex, Typography, Button } from "@strapi/design-system";
import { Layout, Page } from "@strapi/strapi/admin";

const MyCustomPage = () => {
  return (
    <Layout>
      <Page.Header
        title="我的自定义页面"
        subtitle="在这里开发您的业务功能"
        primaryAction={<Button>保存操作</Button>}
      />
      <Page.Content>
        <Box padding={8} background="neutral0">
          <Typography variant="beta">欢迎来到自定义扩展页面</Typography>
        </Box>
      </Page.Content>
    </Layout>
  );
};

export default MyCustomPage;
```

### 注册路由

在 `admin/src/pages/App.jsx` 中使用 `react-router-dom` 注册您的新页面路由：

```jsx
// admin/src/pages/App.jsx
import { Routes, Route } from "react-router-dom";
import MyCustomPage from "./MyCustomPage";

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="settings" element={<SettingsPage />} />
      {/* 注册新路由 */}
      <Route path="my-custom-page" element={<MyCustomPage />} />
    </Routes>
  );
};
```

## 3. 使用 Strapi 设计系统

为了保证 UI 的高度统一，开发时请务必参考：

- **官方组件库**: [@strapi/design-system](https://design-system.strapi.io/)
- **图标库**: [@strapi/icons](https://design-system.strapi.io/icons)

## 4. 国际化支持

在页面中使用 `useIntl` hook 来处理多语言文本：

```jsx
import { useIntl } from "react-intl";
import { getTranslation } from "../utils/getTranslation";

const { formatMessage } = useIntl();

const title = formatMessage({
  id: getTranslation("homepage.title"),
  defaultMessage: "默认标题",
});
```

> [!IMPORTANT]
> 每次修改 `admin/` 下的代码后，如果处于开发模式，Vite 会自动热更新。如果是生产环境，请务必运行 `npm run build` 重新构建管理后台。
