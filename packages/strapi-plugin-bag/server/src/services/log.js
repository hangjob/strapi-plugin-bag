export default ({ strapi }) => ({
  /**
   * 记录一条升级日志
   * @param {Object} data - 升级数据
   */
  async record(data) {
    try {
      return await strapi.query('plugin::strapi-plugin-bag.log').create({
        data,
      });
    } catch (err) {
      strapi.log.error('Failed to record upgrade log:', err);
    }
  },

  async find(params = {}) {
    return await strapi.query('plugin::strapi-plugin-bag.log').findPage({
      orderBy: { publishDate: 'desc', createdAt: 'desc' },
      ...params
    });
  }
});
