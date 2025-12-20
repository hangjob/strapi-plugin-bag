import crypto from 'crypto';
import svgCaptcha from 'svg-captcha';

const issueRefreshToken = async (strapi, userId) => {
  const refreshToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();

  // 从配置或数据库读取有效期（天）
  const settings = await strapi.plugin('strapi-plugin-bag').service('settings').getSettings();
  const days = settings.auth?.refreshTokenExpiresIn || 30;

  expiresAt.setDate(expiresAt.getDate() + days);

  await strapi.query('plugin::strapi-plugin-bag.refresh-token').create({
    data: {
      token: refreshToken,
      expiresAt: expiresAt,
      user: userId,
    },
  });

  return refreshToken;
};

const generateRandomCode = (length = 6) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
};

// 通用验证码校验 Helper
const verifyRequestCaptcha = async (strapi, ctx, configKey) => {
  const settings = await strapi.plugin('strapi-plugin-bag').service('settings').getSettings();
  const config = settings[configKey] || {};
  const { enabled, type } = config.captcha || {};

  // 如果未开启验证码，直接通过
  if (!enabled) return true;

  const { code, key, identifier, email } = ctx.request.body;

  if (!code) {
    throw new Error('请输入验证码');
  }

  let searchIdentifier = identifier || email;
  let searchType = 'email';

  // 判定验证码类型
  // 1. 如果配置强制为 'image'
  // 2. 或者配置为 'any' 且前端传了 key (暗示是图形验证码)
  if (type === 'image' || (type === 'any' && key)) {
    if (!key) throw new Error('缺少图形验证码标识(key)');
    searchIdentifier = key;
    searchType = 'image';
  } 
  // 3. 如果配置强制为 'email'
  // 4. 或者配置为 'any' 且没传 key (暗示是邮箱验证码)
  else if (type === 'email' || (type === 'any' && !key)) {
    searchType = 'email';
    if (!searchIdentifier) throw new Error('缺少邮箱或账号参数');
  }

  const captcha = await strapi.query('plugin::strapi-plugin-bag.captcha').findOne({
    where: {
      identifier: searchIdentifier,
      code: code,
      isUsed: false,
      type: searchType,
      expiresAt: { $gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!captcha) {
    throw new Error('验证码无效或已过期');
  }

  // 标记已使用
  await strapi.query('plugin::strapi-plugin-bag.captcha').update({
    where: { id: captcha.id },
    data: { isUsed: true },
  });

  return true;
};

const auth = ({ strapi }) => ({
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest('请输入账号或密码');
    }

    // 1. 验证码校验 (Login)
    try {
      await verifyRequestCaptcha(strapi, ctx, 'login');
    } catch (err) {
      return ctx.badRequest(err.message);
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: {
        $or: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return ctx.badRequest('账号或密码错误');
    }

    if (!user.confirmed) {
      return ctx.badRequest('您的邮箱尚未验证');
    }

    if (user.blocked) {
      return ctx.badRequest('您的账号已被管理员禁用');
    }

    const validPassword = await strapi
      .plugin('users-permissions')
      .service('user')
      .validatePassword(password, user.password);

    if (!validPassword) {
      return ctx.badRequest('账号或密码错误');
    }

    const token = strapi.plugin('users-permissions').service('jwt').issue({
      id: user.id,
    });

    const refreshToken = await issueRefreshToken(strapi, user.id);

    return {
      jwt: token,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  },

  async getCaptchaImage(ctx) {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: 2,
      color: true,
    });

    const key = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟有效期

    await strapi.query('plugin::strapi-plugin-bag.captcha').create({
      data: {
        identifier: key,
        code: captcha.text, 
        expiresAt,
        isUsed: false,
        type: 'image',
      },
    });

    return {
      key: key,
      svg: captcha.data,
    };
  },

  async sendCode(ctx) {
    const { identifier } = ctx.request.body;
    if (!identifier) {
      return ctx.badRequest('缺少 identifier 参数');
    }

    const code = generateRandomCode(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟有效期

    await strapi.query('plugin::strapi-plugin-bag.captcha').create({
      data: {
        identifier,
        code,
        expiresAt,
        isUsed: false,
        type: 'email',
      },
    });

    strapi.log.info(`[Captcha] Send code ${code} to ${identifier}`);

    return {
      message: '验证码发送成功',
      mockCode: code,
    };
  },

  async register(ctx) {
    // 1. 验证码校验 (Register)
    try {
        await verifyRequestCaptcha(strapi, ctx, 'register');
    } catch (err) {
        return ctx.badRequest(err.message);
    }

    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    const settings = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      return ctx.badRequest('注册功能当前已关闭');
    }

    const params = {
      ...ctx.request.body,
      provider: 'local',
    };

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      return ctx.badRequest('无法找到默认角色配置');
    }

    params.role = role.id;

    try {
      const user = await strapi.plugin('users-permissions').service('user').add(params);
      const token = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });
      const refreshToken = await issueRefreshToken(strapi, user.id);

      return {
        jwt: token,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async refreshToken(ctx) {
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      return ctx.badRequest('缺少 refresh token');
    }

    const storedToken = await strapi.query('plugin::strapi-plugin-bag.refresh-token').findOne({
      where: { token: refreshToken },
      populate: ['user'],
    });

    if (!storedToken) {
      return ctx.badRequest('无效的 refresh token');
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      return ctx.badRequest('Refresh Token 已过期');
    }

    const user = storedToken.user;
    if (!user) {
      return ctx.badRequest('用户不存在');
    }

    const newToken = strapi.plugin('users-permissions').service('jwt').issue({
      id: user.id,
    });

    return {
      jwt: newToken,
    };
  },

  async logout(ctx) {
    const { refreshToken } = ctx.request.body;
    if (refreshToken) {
      await strapi.query('plugin::strapi-plugin-bag.refresh-token').delete({
        where: { token: refreshToken },
      });
    }
    return {
      message: '退出登录成功',
    };
  },

  async me(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }
    return user;
  },

  async changePassword(ctx) {
    return ctx.send('功能待实现');
  },
});

export default auth;
