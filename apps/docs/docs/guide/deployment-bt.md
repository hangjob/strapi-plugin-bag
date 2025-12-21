# 宝塔面板 + GitHub 自动化部署指南

对于使用宝塔面板 (Pagoda) 的开发者，结合 **GitHub Actions** 可以实现一套非常顺畅的自动化部署流程：只需 `git push`，服务器即可自动拉取、构建并重启服务。

## 1. 服务器环境准备

在开始之前，请确保您的宝塔面板已安装以下环境：

- **Node.js 版本管理器**：安装并切换到 Node.js `v22.x` 或更高版本。
- **PM2 管理器**：用于守护 Strapi 进程，确保服务永不掉线。
- **PNPM**：在服务器终端运行 `npm install -g pnpm`。
- **Git**：确保服务器已配置 GitHub 的 SSH Key，能够正常 `git pull`。（参见下文 [SSH Key 配置步骤](#ssh-key-配置步骤)）

## SSH Key 配置步骤

为了让服务器能够免密拉取 GitHub 上的私有仓库，您需要按照以下步骤配置 SSH Key：

### 1. 生成 SSH Key

在服务器终端执行：

```bash
ls -al ~/.ssh # 查看是否已有
ssh-keygen -t rsa -b 4096 -C "您的邮箱@example.com"
```

一路按 **回车** 即可（不要设置密码，否则自动化脚本会阻塞）。

### 2. 获取公钥

执行以下命令并复制输出的完整内容：

```bash
cat ~/.ssh/id_rsa.pub
```

### 3. 在 GitHub 中配置

1. 登录 GitHub，进入您的项目仓库。
2. 前往 **Settings** -> **Deploy keys** -> **Add deploy key**。
3. **Title** 填写“宝塔服务器”，**Key** 粘贴刚才复制的内容。
4. 点击 **Add key**。

### 4. 首次连接测试

在服务器终端执行：

```bash
ssh -T git@github.com
```

看到 `Hi [用户名]! You've successfully authenticated...` 即表示配置成功。

---

## 2. GitHub Actions 自动化脚本 (推荐)

这是最专业的方法。我们将利用 GitHub 提供的服务器，在代码提交时远程指令服务器执行部署动作。

### 第一步：获取服务器信息

您需要：

1.  **服务器 IP**。
2.  **SSH 端口**（默认 22）。
3.  **SSH 私钥**（建议为 GitHub 专门生成一个 Deploy Key）。

### 第二步：配置 GitHub Secrets

GitHub 为了安全，不会直接在页面上显示 IP 等输入框。您需要点击 **New repository secret** 按钮，手动将以下变量一个一个添加进去：

1.  **REMOTE_HOST**:
    - **Name**: `REMOTE_HOST`
    - **Secret**: 填写您的服务器公网 IP 地址。
2.  **REMOTE_USER**:
    - **Name**: `REMOTE_USER`
    - **Secret**: 填写登录服务器的用户名（通常是 `root`）。
3.  **SSH_PRIVATE_KEY**:
    - **Name**: `SSH_PRIVATE_KEY`
    - **Secret**: 粘贴刚才在服务器生成的私钥内容（`cat ~/.ssh/id_rsa` 的完整输出）。
4.  **TARGET_DIR**:
    - **Name**: `TARGET_DIR`
    - **Secret**: 项目在服务器上的绝对路径（例如 `/www/wwwroot/strapi-plugin-bag`）。

> [!NOTE]
> 保存后，GitHub 会隐藏具体内容，您在列表中只能看到变量名，这是正常的安全保护机制。

### 第三步：编写 Workflow 文件

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Server

on:
  push:
    branches: [main] # 只有主分支提交时触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT || 22 }}
          script: |
            cd ${{ secrets.TARGET_DIR }}
            # 1. 拉取最新代码
            git pull origin main
            # 2. 安装依赖
            pnpm install
            # 3. 编译插件和后端
            pnpm build
            # 4. 使用 PM2 重启服务
            # 假设您的 PM2 任务名为 strapi-app
            pm2 restart strapi-app || pm2 start npm --name "strapi-app" -- run start --prefix apps/backend
```

## 3. 使用宝塔 Webhook (简易版)

如果您不想配置复杂的 SSH，可以使用宝塔自带的 **Webhook** 插件。

1.  在宝塔面板安装 **“宝塔 Webhook”** 插件。
2.  新建 Webhook，脚本内容如下：
    ```bash
    #!/bin/bash
    echo "开始部署..."
    cd /www/wwwroot/您的项目路径
    git pull origin main
    pnpm install
    pnpm build
    pm2 reload all
    echo "部署完成！"
    ```
3.  获取 Webhook 链接，将其填入 GitHub 仓库的 **Settings -> Webhooks** 中。

## 4. PM2 进程配置建议

对于 Strapi 5 生产环境，建议在 `apps/backend` 目录下创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: "strapi-bag",
      script: "pnpm",
      args: "start",
      cwd: "./apps/backend",
      env: {
        NODE_ENV: "production",
        PORT: 1339,
      },
    },
  ],
};
```

然后在部署脚本中使用 `pm2 start ecosystem.config.js`。

## 5. 常见问题排查

- **内存不足**：Strapi 编译过程比较吃内存（至少需要 2G）。如果服务器内存较小，建议在本地或 GitHub Actions 中编译好后再上传 `dist` 目录。
- **权限问题**：确保 Webhook 或 SSH 执行的用户对项目目录有写权限。
- **环境变量**：生产环境务必在服务器上配置好 `.env` 文件，不要将其上传到 GitHub。

> [!TIP]
> 推荐使用 **SSH 方式**，因为它更安全，且能实时在 GitHub Actions 界面看到部署日志。
