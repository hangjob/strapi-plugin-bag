export default ({ strapi }) => ({
  async find(params = {}) {
    return await strapi.query('plugin::strapi-plugin-bag.friend-link').findMany({
      where: { 
        isVisible: true,
        ...params.filters 
      },
      populate: ['logo'],
      orderBy: { order: 'asc', createdAt: 'desc' },
      ...params
    });
  },
});

