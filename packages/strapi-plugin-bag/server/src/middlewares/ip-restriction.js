/**
 * `ip-restriction` 中间件
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    const settings = await strapi
      .plugin('strapi-plugin-bag')
      .service('settings')
      .getSettings();
      
    const { enabled, whitelist, blacklist } = settings.ipRestriction || {};

    if (!enabled) {
      return await next();
    }

    const clientIp = ctx.ip;

    // 首先检查黑名单
    if (blacklist && Array.isArray(blacklist) && blacklist.length > 0) {
      if (blacklist.includes(clientIp)) {
        return ctx.forbidden('您的 IP 已被加入黑名单');
      }
    }

    // 如果白名单不为空，则检查白名单
    if (whitelist && Array.isArray(whitelist) && whitelist.length > 0) {
      if (!whitelist.includes(clientIp)) {
        return ctx.forbidden('您的 IP 不在允许访问的白名单中');
      }
    }

    await next();
  };
};

