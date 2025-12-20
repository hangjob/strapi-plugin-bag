export default ({ strapi }) => ({
  async create(ctx) {
    const { body } = ctx.request;
    const { ip, header } = ctx;
    const ua = header['user-agent'];

    try {
      const comment = await strapi
        .plugin('strapi-plugin-bag')
        .service('comment')
        .create({
          ...body,
          ip,
          ua,
        });
      
      ctx.body = { data: comment, message: '评论提交成功，请等待审核' };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findByArticle(ctx) {
    const { articleId } = ctx.params;
    try {
      const comments = await strapi
        .plugin('strapi-plugin-bag')
        .service('comment')
        .getCommentsByArticle(articleId);
      
      ctx.body = { data: comments };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

