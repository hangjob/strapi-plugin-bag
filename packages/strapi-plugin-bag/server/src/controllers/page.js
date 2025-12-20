export default ({ strapi }) => ({
  async find(ctx) {
    try {
      const pages = await strapi
        .plugin('strapi-plugin-bag')
        .service('page')
        .find(ctx.query);
      
      ctx.body = { data: pages };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findOne(ctx) {
    const { slug } = ctx.params;
    try {
      const page = await strapi
        .plugin('strapi-plugin-bag')
        .service('page')
        .findOne(slug, ctx.query);
      
      if (!page) {
        return ctx.notFound('Page not found');
      }
      
      ctx.body = { data: page };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

