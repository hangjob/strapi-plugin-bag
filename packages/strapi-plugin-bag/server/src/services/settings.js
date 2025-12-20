/**
 *  Settings service
 */

export default ({ strapi }) => ({
  async getSettings() {
    const pluginConfig = strapi.config.get('plugin::strapi-plugin-bag');
    const storedSettings = await strapi.store({
      type: 'plugin',
      name: 'strapi-plugin-bag',
      key: 'settings',
    }).get();

    return {
      ipRestriction: {
        ...pluginConfig.ipRestriction,
        ...(storedSettings?.ipRestriction || {}),
      },
      login: {
        ...pluginConfig.login,
        ...(storedSettings?.login || {}),
      },
      register: {
        ...pluginConfig.register,
        ...(storedSettings?.register || {}),
      },
      encryption: {
        ...pluginConfig.encryption,
        ...(storedSettings?.encryption || {}),
      },
      auth: {
        ...pluginConfig.auth,
        ...(storedSettings?.auth || {}),
      },
    };
  },

  async setSettings(settings) {
    return strapi.store({
      type: 'plugin',
      name: 'strapi-plugin-bag',
      key: 'settings',
    }).set({ value: settings });
  },
});

