/**
 *  Menu controller
 */

export default ({ strapi }) => ({
  async findOne(ctx) {
    const { slug } = ctx.params;
    try {
      const menu = await strapi
        .plugin('strapi-plugin-bag')
        .service('menu')
        .getMenuBySlug(slug);

      if (!menu) {
        return ctx.notFound('Menu not found');
      }

      ctx.body = { data: menu };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

