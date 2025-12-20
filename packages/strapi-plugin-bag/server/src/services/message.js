export default ({ strapi }) => ({
  async create(data) {
    return await strapi.query('plugin::strapi-plugin-bag.message').create({
      data: {
        ...data,
        status: 'pending',
      },
    });
  },

  async find(params = {}) {
    return await strapi.query('plugin::strapi-plugin-bag.message').findPage(params);
  }
});

