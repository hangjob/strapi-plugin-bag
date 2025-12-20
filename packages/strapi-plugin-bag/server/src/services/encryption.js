import crypto from 'crypto';

let rsaKeys = null;
let cachedAesKey = null;

// AES-GCM 配置
const AES_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM 标准 IV 长度
const TAG_LENGTH = 16; // GCM Auth Tag 长度

export default ({ strapi }) => ({
  async getAesKey() {
    if (cachedAesKey) return cachedAesKey;

    // 1. 优先从设置读取
    const settings = await strapi.plugin('strapi-plugin-bag').service('settings').getSettings();
    const secret = settings.encryption?.aes?.secret || process.env.AES_SECRET;

    if (secret) {
      cachedAesKey = crypto.scryptSync(secret, 'salt', 32);
      return cachedAesKey;
    }

    // 2. 如果没配置且没有环境变量，则生成临时秘钥
    if (!global.TEMP_AES_KEY) {
      global.TEMP_AES_KEY = crypto.randomBytes(32);
      console.warn(
        '[strapi-plugin-bag] Warning: AES secret not configured. Using temporary key. Data cannot be decrypted after restart.'
      );
    }
    cachedAesKey = global.TEMP_AES_KEY;
    return cachedAesKey;
  },

  async getRsaKeys() {
    // 1. 优先从内存缓存读取
    if (rsaKeys) return rsaKeys;

    // 2. 尝试从数据库设置读取
    const settings = await strapi.plugin('strapi-plugin-bag').service('settings').getSettings();
    const { publicKey, privateKey } = settings.encryption?.rsa || {};

    if (publicKey && privateKey) {
      rsaKeys = { publicKey, privateKey };
      return rsaKeys;
    }

    // 3. 如果没配置，则生成临时密钥
    const generated = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    rsaKeys = { publicKey: generated.publicKey, privateKey: generated.privateKey };
    console.warn('[strapi-plugin-bag] Warning: RSA keys not configured in settings. Using temporary keys generated in memory.');
    return rsaKeys;
  },

  clearCache() {
    rsaKeys = null;
    cachedAesKey = null;
  },

  async aesEncrypt(text) {
    const key = await this.getAesKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const tag = cipher.getAuthTag();

    const combined = Buffer.concat([encrypted, tag, iv]);
    return combined.toString('base64');
  },

  async aesDecrypt(text) {
    const key = await this.getAesKey();
    const combined = Buffer.from(text, 'base64');

    const iv = combined.subarray(combined.length - IV_LENGTH);
    const ciphertextAndTag = combined.subarray(0, combined.length - IV_LENGTH);
    const tag = ciphertextAndTag.subarray(ciphertextAndTag.length - TAG_LENGTH);
    const encrypted = ciphertextAndTag.subarray(0, ciphertextAndTag.length - TAG_LENGTH);

    const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  },

  async getPublicKey() {
    const keys = await this.getRsaKeys();
    return keys.publicKey;
  },

  async rsaDecrypt(encryptedText) {
    const keys = await this.getRsaKeys();
    const buffer = Buffer.from(encryptedText, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: keys.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return decrypted.toString('utf8');
  },

  async rsaEncrypt(text) {
    const keys = await this.getRsaKeys();
    const encrypted = crypto.publicEncrypt(
      {
        key: keys.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(text)
    );
    return encrypted.toString('base64');
  },
});
