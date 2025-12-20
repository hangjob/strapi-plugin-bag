const utils = ({ strapi }) => ({
  async getRsaPublicKey(ctx) {
    const publicKey = await strapi.plugin('strapi-plugin-bag').service('encryption').getPublicKey();
    ctx.body = { publicKey };
  },

  async rsaDecrypt(ctx) {
    const { data } = ctx.request.body;
    if (!data) return ctx.badRequest('Missing data');
    try {
      const decrypted = await strapi.plugin('strapi-plugin-bag').service('encryption').rsaDecrypt(data);
      ctx.body = { decrypted };
    } catch (e) {
      return ctx.badRequest('Decryption failed');
    }
  },

  async rsaEncrypt(ctx) {
    const { data } = ctx.request.body;
    if (!data) return ctx.badRequest('Missing data');
    const encrypted = await strapi.plugin('strapi-plugin-bag').service('encryption').rsaEncrypt(data);
    ctx.body = { encrypted };
  },

  async aesEncrypt(ctx) {
    const { data } = ctx.request.body;
    if (!data) return ctx.badRequest('Missing data');
    const encrypted = await strapi.plugin('strapi-plugin-bag').service('encryption').aesEncrypt(data);
    ctx.body = { encrypted };
  },

  async aesDecrypt(ctx) {
    const { data } = ctx.request.body;
    if (!data) return ctx.badRequest('Missing data');
    try {
      const decrypted = await strapi.plugin('strapi-plugin-bag').service('encryption').aesDecrypt(data);
      ctx.body = { decrypted };
    } catch (e) {
      return ctx.badRequest('Decryption failed');
    }
  },
});

export default utils;

