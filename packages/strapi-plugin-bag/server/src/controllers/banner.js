export default ({ strapi }) => ({
  async find(ctx) {
    try {
      const banners = await strapi
        .plugin('strapi-plugin-bag')
        .service('banner')
        .find(ctx.query);
      
      ctx.body = { data: banners };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findByGroup(ctx) {
    const { group } = ctx.params;
    try {
      const banners = await strapi
        .plugin('strapi-plugin-bag')
        .service('banner')
        .findByGroup(group);
      
      ctx.body = { data: banners };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

