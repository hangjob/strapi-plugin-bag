# 菜单导航系统

本插件提供了一个强大的菜单导航管理系统，特别适用于博客、企业门户等需要灵活配置导航链接的网站。

## 功能特性

- **多菜单支持**：可以创建多个独立的菜单实例（如“主导航”、“页脚菜单”、“侧边栏链接”）。
- **无限级嵌套**：支持菜单项的多级父子关联，轻松构建复杂的树形导航结构。
- **可视化属性**：支持为每个菜单项配置 **图标 (Icon)** 和 **高亮 (Hot)** 标识。
- **自定义打开方式**：支持配置链接在当前窗口 (`_self`) 或新窗口 (`_blank`) 打开。
- **树形数据接口**：提供专用的 API 接口，直接返回格式化好的树形 JSON 数据。

## 如何配置

### 1. 创建菜单 (Menu)

在 Strapi 后台的 `Content Manager` 中找到 `Bag - 菜单 (Menu)`：

![菜单管理列表](/screenshots/content-manager.png)

- **标题 (Title)**: 菜单的友好名称，如“主导航”。
- **标识符 (Slug)**: 唯一的标识，API 调用时使用，如 `main-nav`。

### 2. 添加菜单项 (Menu Item)

在 `Bag - 菜单项 (Menu Item)` 中添加具体的链接：

- **标题 (Title)**: 菜单显示的文字。
- **URL**: 链接地址（可以是相对路径 `/blog` 或绝对路径 `https://...`）。
- **图标 (Icon)**: 可选，填入图标名称。
- **火/高亮 (isHot)**: 勾选后，前端可以根据此标识渲染高亮样式（如红色 Hot 标签）。
- **排序 (Order)**: 数字越小越靠前。
- **父级菜单项**: 选择该项的父级，实现嵌套。
- **所属菜单**: 必须选择所属的菜单容器。

## API 调用

插件提供了一个专用的 Content API 接口来获取树形菜单：

**接口地址:** `GET /api/bag/menus/:slug`

### 示例请求

```bash
GET http://localhost:1337/api/bag/menus/main-nav
```

### 响应示例

```json
{
  "data": {
    "id": 1,
    "title": "主导航",
    "slug": "main-nav",
    "items": [
      {
        "id": 1,
        "title": "首页",
        "url": "/",
        "target": "_self",
        "icon": "home",
        "isHot": false,
        "order": 0,
        "children": []
      },
      {
        "id": 2,
        "title": "热门产品",
        "url": "/products",
        "target": "_self",
        "icon": "fire",
        "isHot": true,
        "order": 1,
        "children": [
          {
            "id": 3,
            "title": "智能手机",
            "url": "/products/phone",
            "target": "_self",
            "isHot": false,
            "children": []
          }
        ]
      }
    ]
  }
}
```

## 高级扩展

本插件完全支持 Strapi 的扩展机制。如果您需要为菜单项增加自定义字段（如：副标题、权限标识、关联图片等），可以直接在您的 Strapi 项目中进行扩展：

1. 创建文件：`src/extensions/strapi-plugin-bag/content-types/menu-item/schema.json`
2. 添加您的字段定义。
3. 重新启动项目。

所有自定义扩展的字段将**自动包含**在 `/api/bag/menus/:slug` 接口的返回结果中。
