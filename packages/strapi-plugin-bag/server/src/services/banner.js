export default ({ strapi }) => ({
  async find(params = {}) {
    return await strapi.query('plugin::strapi-plugin-bag.banner').findMany({
      where: { 
        isVisible: true,
        publishedAt: { $notNull: true }, // 只获取已发布的
        ...params.filters 
      },
      populate: ['image'],
      orderBy: { order: 'asc', createdAt: 'desc' },
      ...params
    });
  },

  async findByGroup(group) {
    return await this.find({
      filters: { group }
    });
  }
});

