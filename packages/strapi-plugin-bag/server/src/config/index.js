export default {
  default: {
    login: {
      captcha: {
        enabled: false, // 默认关闭登录验证码，需手动开启
        type: 'image',  // options: 'image', 'email', 'any'
      },
    },
    register: {
      captcha: {
        enabled: true,  // 默认开启注册验证码
        type: 'email',  // options: 'image', 'email', 'any'
      },
    },
    auth: {
      refreshTokenExpiresIn: 30, // Refresh Token 有效期（天）
    },
    ipRestriction: {
      enabled: false,
      whitelist: [], // e.g., ['127.0.0.1']
      blacklist: [], // e.g., ['192.168.1.1']
    },
    encryption: {
      rsa: {
        publicKey: '',
        privateKey: '',
      },
      aes: {
        secret: '',
      },
    },
  },
  validator() {},
};
