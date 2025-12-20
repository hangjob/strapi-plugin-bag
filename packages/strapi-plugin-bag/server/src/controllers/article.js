export default ({ strapi }) => ({
  async find(ctx) {
    try {
      const { results, pagination } = await strapi
        .plugin('strapi-plugin-bag')
        .service('article')
        .find(ctx.query);
      
      ctx.body = { data: results, meta: { pagination } };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findOne(ctx) {
    const { slug } = ctx.params;
    try {
      const article = await strapi
        .plugin('strapi-plugin-bag')
        .service('article')
        .findOne(slug, ctx.query);
      
      if (!article) {
        return ctx.notFound('Article not found');
      }
      
      ctx.body = { data: article };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

