/**
 *  Settings controller
 */

export default ({ strapi }) => ({
  async getSettings(ctx) {
    try {
      ctx.body = await strapi
        .plugin('strapi-plugin-bag')
        .service('settings')
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async updateSettings(ctx) {
    try {
      const { body } = ctx.request;
      await strapi
        .plugin('strapi-plugin-bag')
        .service('settings')
        .setSettings(body);
      
      // 清除加密服务的内存缓存，使新密钥生效
      strapi.plugin('strapi-plugin-bag').service('encryption').clearCache();

      ctx.body = { ok: true };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});

