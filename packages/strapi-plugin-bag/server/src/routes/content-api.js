export default [
  {
    method: 'GET',
    path: '/',
    handler: 'controller.index',
    config: {
      policies: [],
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'GET',
    path: '/auth/captcha-image',
    handler: 'auth.getCaptchaImage',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'GET',
    path: '/auth/send-code',
    handler: 'auth.sendCode',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/auth/send-code',
    handler: 'auth.sendCode',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/auth/register',
    handler: 'auth.register',
    config: {
      auth: false,
      policies: [],
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: 'auth.login',
    config: {
      auth: false,
      policies: [],
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/auth/refresh-token',
    handler: 'auth.refreshToken',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: 'auth.logout',
    config: {
      auth: false,
      policies: [],
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'GET',
    path: '/auth/me',
    handler: 'auth.me',
    config: {
      policies: [],
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/auth/change-password',
    handler: 'auth.changePassword',
    config: {
      policies: [],
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Utils Routes
  {
    method: 'GET',
    path: '/utils/rsa/public-key',
    handler: 'utils.getRsaPublicKey',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/utils/rsa/decrypt',
    handler: 'utils.rsaDecrypt',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/utils/rsa/encrypt',
    handler: 'utils.rsaEncrypt',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/utils/aes/encrypt',
    handler: 'utils.aesEncrypt',
    config: {
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'POST',
    path: '/utils/aes/decrypt',
    handler: 'utils.aesDecrypt',
    config: {
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Menu Routes
  {
    method: 'GET',
    path: '/menus/:slug',
    handler: 'menu.findOne',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Article Routes
  {
    method: 'GET',
    path: '/articles',
    handler: 'article.find',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'GET',
    path: '/articles/:slug',
    handler: 'article.findOne',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Comment Routes
  {
    method: 'POST',
    path: '/comments',
    handler: 'comment.create',
    config: {
      auth: false, // 允许游客评论
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'GET',
    path: '/articles/:articleId/comments',
    handler: 'comment.findByArticle',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Banner Routes
  {
    method: 'GET',
    path: '/banners',
    handler: 'banner.find',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'GET',
    path: '/banners/:group',
    handler: 'banner.findByGroup',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Friend Link Routes
  {
    method: 'GET',
    path: '/friend-links',
    handler: 'friendLink.find',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Page Routes
  {
    method: 'GET',
    path: '/pages',
    handler: 'page.find',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  {
    method: 'GET',
    path: '/pages/:slug',
    handler: 'page.findOne',
    config: {
      auth: false,
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
  // Message Board Routes
  {
    method: 'POST',
    path: '/messages',
    handler: 'message.create',
    config: {
      auth: false, // 允许游客留言
      middlewares: ['plugin::strapi-plugin-bag.ipRestriction'],
    },
  },
];
