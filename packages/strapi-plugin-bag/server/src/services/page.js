export default ({ strapi }) => ({
  async find(params = {}) {
    return await strapi.query('plugin::strapi-plugin-bag.page').findMany({
      where: { 
        publishedAt: { $notNull: true },
        ...params.filters 
      },
      populate: ['cover'],
      ...params
    });
  },

  async findOne(slug, params = {}) {
    const page = await strapi.query('plugin::strapi-plugin-bag.page').findOne({
      where: { slug },
      populate: ['cover'],
      ...params,
    });

    if (page) {
      // 增加阅读量
      await strapi.query('plugin::strapi-plugin-bag.page').update({
        where: { id: page.id },
        data: { views: (page.views || 0) + 1 },
      });
    }

    return page;
  },
});

