export default ({ strapi }) => ({
  async find(ctx) {
    try {
      const links = await strapi
        .plugin('strapi-plugin-bag')
        .service('friend-link')
        .find(ctx.query);
      
      ctx.body = { data: links };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

