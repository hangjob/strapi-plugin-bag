export default ({ strapi }) => ({
  async find(params = {}) {
    const { results, pagination } = await strapi.query('plugin::strapi-plugin-bag.article').findPage({
      ...params,
      populate: ['category', 'tags', 'cover', 'author'],
      orderBy: { isTop: 'desc', createdAt: 'desc' },
    });

    return { results, pagination };
  },

  async findOne(slug, params = {}) {
    const article = await strapi.query('plugin::strapi-plugin-bag.article').findOne({
      where: { slug },
      populate: ['category', 'tags', 'cover', 'author'],
      ...params,
    });

    if (article) {
      // 增加阅读量
      await strapi.query('plugin::strapi-plugin-bag.article').update({
        where: { id: article.id },
        data: { views: (article.views || 0) + 1 },
      });
    }

    return article;
  },
});

