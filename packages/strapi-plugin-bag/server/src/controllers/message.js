export default ({ strapi }) => ({
  async create(ctx) {
    const { body } = ctx.request;
    const { ip, header } = ctx;
    const ua = header['user-agent'];

    try {
      const message = await strapi
        .plugin('strapi-plugin-bag')
        .service('message')
        .create({
          ...body,
          ip,
          ua,
        });
      
      ctx.body = { data: message, message: '您的留言已提交，我们会尽快处理' };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

