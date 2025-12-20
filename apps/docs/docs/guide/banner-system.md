# 幻灯片管理系统

本模块用于管理网站各页面的视觉焦点，如首页大图轮播、营销位幻灯片等。

## 模型结构 (Banner)

- **标题 (Title)**: 幻灯片的主标题。
- **副标题 (Subtitle)**: 简短的文字描述。
- **图片资源 (Image)**: 核心素材，支持 Strapi 媒体库。
- **跳转链接 (Link)**: 点击后跳转的 URL 地址。
- **排序权重 (Order)**: 数字越小越靠前。
- **分组标识 (Group)**: 用于区分不同页面的幻灯片。默认为 `home`（首页），你也可以填入 `blog`、`about` 等自定义标识。
- **是否可见 (IsVisible)**: 快捷控制显示或隐藏。

---

## API 调用

### 1. 获取所有可见幻灯片
默认返回所有 `isVisible` 为 true 且已发布的项。

**接口地址:** `GET /api/bag/banners`

### 2. 按分组获取幻灯片
这是最常用的方式，用于获取特定页面（如首页）的轮播图。

**接口地址:** `GET /api/bag/banners/:group`

**示例:** `GET /api/bag/banners/home`

---

## 前端集成建议

1. **分组加载**: 在首页调用 `/api/bag/banners/home`，在博客页调用 `/api/bag/banners/blog`。
2. **状态管理**: 插件已内置 `draftAndPublish` 机制，只有点击“发布 (Publish)”后的幻灯片才会被 API 返回。
3. **渲染技巧**: 建议使用 `Swiper` 或 `Ant Design Carousel` 等库配合本接口返回的数据进行渲染。

