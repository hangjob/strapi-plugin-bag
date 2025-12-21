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

### 1. 生成 SSH Key (公钥与私钥)

在服务器终端执行以下命令，**一路按回车**即可（不要设置密码，否则自动化脚本会阻塞）：

```bash
# 检查是否已有 Key
ls -al ~/.ssh

# 生成新 Key (若提示文件已存在可跳过或覆盖)
ssh-keygen -t rsa -b 4096 -C "您的邮箱@example.com"
```

### 2. 获取并配置“公钥” (用于 GitHub 仓库访问)

公钥相当于“门锁”，安装在 GitHub 上：

1.  **查看公钥**：执行 `cat ~/.ssh/id_rsa.pub` 并复制内容。
2.  **配置 GitHub**：进入项目仓库 -> **Settings** -> **Deploy keys** -> **Add deploy key**。
3.  **Title** 填写“宝塔服务器”，**Key** 粘贴内容，点击 **Add key**。

### 3. 获取并配置“私钥” (用于 GitHub Actions 登录服务器)

私钥相当于“钥匙”，交给 GitHub Actions 保管：

1.  **查看私钥**：执行 `cat ~/.ssh/id_rsa` 并复制**全部内容**（必须包含 `-----BEGIN...` 和 `-----END...`）。
2.  **配置 Secrets**：进入项目仓库 -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**。
3.  **Name** 填写 `SSH_PRIVATE_KEY`，**Value** 粘贴内容，点击 **Add secret**。

### 4. 允许通过密钥登录服务器 (重要)

GitHub Actions 是通过 SSH 协议“登录”您的服务器来执行脚本的，因此必须将公钥加入服务器的信任列表：

1.  **添加至信任列表**：在服务器终端执行：
    ```bash
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
    ```
2.  **设置权限**（SSH 对文件权限要求极严，若权限过大将导致连接失败）：
    ```bash
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    ```
3.  **宝塔面板配置**：
    - 前往宝塔面板 -> **安全** -> **SSH管理**。
    - 确保“SSH服务”已开启。
    - 登录方式建议选择 **“密码+密钥”**。

### 5. 首次连接测试 (必须手动执行)

为了让服务器信任 GitHub，必须在服务器终端手动执行一次：

```bash
ssh -T git@github.com
```

看到 `Are you sure you want to continue connecting (yes/no)?` 时，输入 **yes** 并回车。看到 `Hi [用户名]!` 即表示配置成功。

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
name: Deploy to BT Server

on:
  push:
    branches: [main] # 当代码推送到 main 分支时触发
  workflow_dispatch: # 允许手动触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH Remote Deployment
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT || 22 }}
          script: |
            # 兼容宝塔面板的路径加载
            export PATH=$PATH:/usr/local/bin:/usr/bin:/root/bin
            # 自动加载宝塔默认的 Node.js 路径
            export PATH=$PATH:$(find /www/server/nodejs -maxdepth 3 -type d -name "bin" 2>/dev/null | head -n 1)

            cd ${{ secrets.TARGET_DIR }}

            # 1. 拉取最新代码
            git pull origin main

            # 2. 安装依赖
            pnpm install --no-frozen-lockfile

            # 3. 构建项目 (Turborepo 并行构建)
            pnpm build

            # 4. 重启服务 (使用配置文件)
            pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js

            echo "🚀 部署完成！"
```

## 3. 宝塔面板部署避坑指南 (重要)

在使用宝塔面板进行自动化部署时，您可能会遇到以下常见报错。请根据实际情况执行修复命令：

### A. 报错：`ssh: no key found`

- **原因**：GitHub Secrets 中的 `SSH_PRIVATE_KEY` 格式不正确。
- **修复**：确保粘贴的内容**包含**以下开头和结尾行，且中间没有任何多余的空格：
  ```text
  -----BEGIN OPENSSH PRIVATE KEY-----
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```

### B. 报错：`handshake failed: [none publickey]`

- **原因**：服务器未将该密钥加入信任列表，或权限设置不当。
- **修复**：在服务器终端执行：
  ```bash
  # 1. 强行建立信任
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  # 2. 修正权限 (关键)
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  # 3. 重启 SSH 服务
  systemctl restart sshd
  ```

### C. 报错：`pnpm: command not found`

- **原因**：非交互式 SSH 环境无法识别宝塔安装的 Node/pnpm 路径。
- **修复**：在服务器终端建立系统级软链接：
  ```bash
  ln -sf $(which pnpm) /usr/bin/pnpm
  ln -sf $(which node) /usr/bin/node
  ln -sf $(which pm2) /usr/bin/pm2
  ```

---

## 4. 使用宝塔 Webhook (简易版)

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

对于 Strapi 5 生产环境，建议在项目根目录下使用 `ecosystem.config.js` 配置文件进行管理：

```javascript
module.exports = {
  apps: [
    {
      name: "strapi-bag", // 进程名称
      script: "pnpm", // 启动命令
      args: "start", // 启动参数
      cwd: "./apps/backend", // 运行目录
      interpreter: "none", // 不使用特定解释器
      env: {
        NODE_ENV: "production", // 生产环境
        PORT: 1339, // 端口号
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G", // 内存超过 1G 自动重启
    },
  ],
};
```

## 5. 验证部署是否成功

提交代码并推送至 GitHub 后，您可以通过以下方式确认部署状态：

### A. 查看 GitHub Actions (第一现场)

- 前往 GitHub 仓库的 **Actions** 选项卡。
- 检查 `Deploy to BT Server` 工作流是否显示为绿色勾勾。如果为红色，点击进入查看报错日志。

### B. 查看 PM2 在线时间

在服务器终端运行：

```bash
pm2 list
```

检查 `strapi-bag` 的 **uptime** 列。如果时间很短（如 `1m`），说明自动化脚本刚刚成功触发了重启。

### C. 检查代码同步状态

在服务器项目目录下运行：

```bash
git log -1
```

确认最后一条提交记录是否与您在本地推送的内容一致。

### D. 实时监控 (进阶)

在服务器终端运行 `pm2 monit`，您可以实时观察到部署脚本触发服务重启的瞬间。

## 6. 域名访问与反向代理 (Nginx)

为了通过域名（如 `api.yourdomain.com`）访问 Strapi，建议在宝塔中使用“反向代理”方案。

### 第一步：创建站点

1.  前往宝塔面板 -> **网站** -> **添加站点**。
2.  **域名**：填写您的真实域名。
3.  **PHP版本**：选择“纯静态”。
4.  点击提交。

### 第二步：配置反向代理

1.  在站点列表中点击刚才创建的域名 -> **设置**。
2.  点击 **反向代理** -> **添加反向代理**。
3.  **代理名称**：填写 `strapi`。
4.  **目标URL**：填写 `http://127.0.0.1:1339`（确保端口与 `ecosystem.config.js` 一致）。
5.  点击提交。

### 第三步：开启 HTTPS (可选)

1.  在站点设置中点击 **SSL**。
2.  选择 **Let's Encrypt**，勾选域名并申请。
3.  申请成功后开启 **“强制HTTPS”**。

![宝塔反向代理配置](/screenshots/bt-reverse-proxy.png)

## 7. 部署建议：为什么不使用宝塔的“Node项目”模块？

在部署 Strapi 5 Monorepo 项目时，我们**强烈建议**通过 PM2 命令行管理，而不是使用宝塔面板自带的“Node项目”模块。

**原因如下：**

- **路径限制**：Strapi 5 的核心在 `apps/backend`，宝塔的 Node 模块往往无法正确识别这种深层路径。
- **启动逻辑**：Strapi 需要 `pnpm start` 配合特定的环境变量，宝塔默认的启动逻辑经常报错。
- **自动化冲突**：GitHub Actions 是直接通过 PM2 命令行操作的。如果同时使用宝塔的 UI 模块，会导致端口占用或进程冲突。

**最佳实践**：

1. 使用 **PM2 (命令行)** 守护进程。
2. 使用 **PHP项目 (静态站点)** 做 Nginx 反向代理。
3. 使用 **GitHub Actions** 自动化运维。

## 8. 常见问题排查

- **端口未放行**：修改端口（如 1339）后，务必在宝塔面板的“安全”设置中手动放行。
- **内存不足**：Strapi 编译较吃内存（至少 2G）。若服务器配置较低，编译可能失败，建议开启虚拟内存或本地编译。
- **SSH 权限**：若 `git pull` 报错，通常是服务器 SSH Key 未正确添加至 GitHub 的 Deploy Keys。
- **分支匹配**：默认监听 `main` 分支，推送到其他分支不会触发部署。
- **环境变量**：生产环境务必在服务器上配置好 `.env` 文件，不要将其上传到 GitHub。

> [!TIP]
> 推荐使用 **SSH 方式**，因为它更安全，且能实时在 GitHub Actions 界面看到部署日志。
