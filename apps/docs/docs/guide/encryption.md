# 加密工具指南

`strapi-plugin-bag` 提供了一套开箱即用的加密工具集，支持 **RSA 非对称加密** 和 **AES 对称加密**。这对于在前后端之间传输敏感数据（如密码、身份证号）或在数据库中存储隐私信息非常有用。

本插件的加密实现与现代 Web Crypto API 兼容，支持与前端 SDK 无缝互通。

## 概览

### 1. 非对称加密 (RSA)
*   **适用场景**: 前端加密传输密码，后端解密。
*   **算法**: `RSA-OAEP`
*   **参数**: Hash: `SHA-256`, Modulus Length: `2048`
*   **原理**: 插件启动时自动生成临时 RSA 密钥对（存内存）。前端获取公钥加密，后端使用私钥解密。
*   **注意**: 密钥对在服务器重启后会重置（更安全，但不能用于持久化存储加密数据）。

### 2. 对称加密 (AES)
*   **适用场景**: 系统内部加密存储（如身份证号），或服务端之间通信。
*   **算法**: `AES-256-GCM` (相比 CBC 模式，GCM 提供了认证加密，更安全且无需手动 Padding)。
*   **格式**: Base64 编码的 `[Ciphertext + AuthTag(16 bytes) + IV(12 bytes)]`。
*   **配置**: 建议在 `.env` 中设置 `AES_SECRET` 以保证密钥持久化。否则默认使用临时随机密钥（重启后旧数据无法解密）。

---

## 环境变量配置

如果使用 AES 加密进行持久化存储，**必须**设置以下环境变量：

```bash
# 32字节的字符串 (会自动进行 Scrypt 派生)
AES_SECRET=your_secure_secret_key_here
```

---

## API 参考

所有插件接口的基础路径为 `/api/strapi-plugin-bag`。

### 1. 获取 RSA 公钥

前端在加密前，需要先调用此接口获取当前的公钥。

**接口地址:** `GET /utils/rsa/public-key`

**响应:**

```json
{
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A..."
}
```

### 2. RSA 加密

使用服务器公钥加密数据（通常由前端 JS 库完成，但也提供后端接口）。

**接口地址:** `POST /utils/rsa/encrypt`

**请求体:**

```json
{
  "data": "hello world"
}
```

**响应:**

```json
{
  "encrypted": "L8/..." // Base64 格式的加密字符串
}
```

### 3. RSA 解密

使用服务器私钥解密数据。常用于解密前端传来的敏感字段。

**接口地址:** `POST /utils/rsa/decrypt`

**请求体:**

```json
{
  "data": "L8/..." // Base64 格式的加密字符串
}
```

**响应:**

```json
{
  "decrypted": "hello world"
}
```

---

### 4. AES 加密

使用 AES-256-GCM 算法加密数据。

**接口地址:** `POST /utils/aes/encrypt`

**请求体:**

```json
{
  "data": "sensitive data"
}
```

**响应:**

```json
{
  "encrypted": "YmFzZTY0Li4u" // Base64 字符串 (包含密文、Tag 和 IV)
}
```

### 5. AES 解密

解密 AES 加密的数据。

**接口地址:** `POST /utils/aes/decrypt`

**请求体:**

```json
{
  "data": "YmFzZTY0Li4u"
}
```

**响应:**

```json
{
  "decrypted": "sensitive data"
}
```
