# 友情链接管理

本模块用于管理网站的合作伙伴、友情链接或技术大佬推荐，有助于提升网站的 SEO 和社交互动。

## 模型结构 (Friend Link)

- **网站名称 (Name)**: 友链显示的标题。
- **网站链接 (URL)**: 点击后跳转的地址。
- **Logo 图标 (Logo)**: 网站的 Logo 或头像。
- **网站描述 (Description)**: 简短的一句话介绍。
- **排序权重 (Order)**: 数字越小越靠前。
- **链接分类 (Category)**:
  - `合作伙伴 (partner)`
  - `友情链接 (friend)`
  - `其他链接 (other)`
- **是否可见 (IsVisible)**: 快捷控制显示或隐藏。

---

## API 调用

### 获取所有可见友情链接
默认返回所有 `isVisible` 为 true 的项，并按 `Order` 升序排列。

**接口地址:** `GET /api/bag/friend-links`

---

## 前端集成建议

1. **分类显示**: 前端可以根据 `category` 字段将链接分组显示在页脚或专门的“友链”页面。
2. **SEO 优化**: 建议在渲染链接时，根据需要添加 `rel="nofollow"`（针对普通友链）或 `rel="noopener noreferrer"`。
3. **Logo 占位**: 如果友链没有配置 Logo，建议前端显示一个默认的通用图标。

