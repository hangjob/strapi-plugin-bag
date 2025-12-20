export default ({ strapi }) => ({
  async create(data) {
    return await strapi.query('plugin::strapi-plugin-bag.comment').create({
      data: {
        ...data,
        status: 'pending', // 默认待审核
      },
    });
  },

  async getCommentsByArticle(articleId) {
    const comments = await strapi.query('plugin::strapi-plugin-bag.comment').findMany({
      where: { 
        article: articleId,
        status: 'approved' // 只获取审核通过的
      },
      populate: ['author', 'parent'],
      orderBy: { createdAt: 'desc' },
    });

    // 转换为树形结构
    const convertToTree = (items, parentId = null) => {
      return items
        .filter(item => {
          const itemParentId = item.parent ? item.parent.id : null;
          return itemParentId === parentId;
        })
        .map(item => ({
          ...item,
          children: convertToTree(items, item.id),
        }));
    };

    return convertToTree(comments);
  },
});

