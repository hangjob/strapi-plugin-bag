/**
 *  Menu service
 */

export default ({ strapi }) => ({
  async getMenuBySlug(slug) {
    // 1. 获取菜单容器及其所有关联的菜单项
    const menu = await strapi.query('plugin::strapi-plugin-bag.menu').findOne({
      where: { slug },
      populate: ['items'],
    });

    if (!menu) return null;

    // 2. 获取该菜单下的所有菜单项，并按 order 排序
    const allItems = await strapi.query('plugin::strapi-plugin-bag.menu-item').findMany({
      where: { menu: menu.id },
      populate: ['parent'],
      orderBy: { order: 'asc' },
    });

    // 3. 将扁平列表转换为树形结构
    const convertToTree = (items, parentId = null) => {
      return items
        .filter(item => {
          const itemParentId = item.parent ? item.parent.id : null;
          return itemParentId === parentId;
        })
        .map(item => {
          // 动态提取所有字段，但排除掉关联字段（parent, menu, children 等）
          const { parent, menu, children, ...rest } = item;
          
          return {
            ...rest,
            children: convertToTree(items, item.id),
          };
        });
    };

    // 4. 构建最终返回对象，同样支持动态扩展字段
    const { items: _unused, ...menuRest } = menu;

    return {
      ...menuRest,
      items: convertToTree(allItems),
    };
  },
});

