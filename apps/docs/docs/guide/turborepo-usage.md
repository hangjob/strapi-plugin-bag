# Turborepo 使用指南

本项目采用 **Turborepo** 作为 Monorepo（单体仓库）的管理引擎。Turborepo 极大地提升了多包项目的开发效率、构建速度以及任务编排体验。

## 核心价值

- **极速构建**：通过智能缓存机制，绝不重复执行已经运行过的任务。
- **并行执行**：自动分析包之间的依赖关系，以最优的拓扑顺序并行运行任务。
- **增量更新**：只对发生变化的代码包执行任务，节省大量等待时间。

## 项目结构

在我们的项目中，Turborepo 管理着以下主要部分：

- `apps/backend`: Strapi 5 核心服务端应用。
- `apps/docs`: 基于 VitePress 的文档中心。
- `packages/strapi-plugin-bag`: 核心插件包。

## 常用命令

所有的 Turborepo 任务都已集成在根目录的 `package.json` 中，您可以通过 `pnpm` 调用：

### 1. 全局开发模式

启动所有应用（后端 + 文档）的开发服务器：

```bash
pnpm dev
```

### 2. 全局构建

并行构建所有应用和包：

```bash
pnpm build
```

### 3. 代码校验

运行全量 Lint 检查：

```bash
pnpm lint
```

## 过滤器 (--filter)

这是 Turborepo 最强大的功能之一。如果您只想针对某个特定包执行任务，可以使用 `--filter` 标志。

### 示例：

- **只启动后端应用**:

  ```bash
  pnpm dev --filter backend
  ```

- **只构建文档**:

  ```bash
  pnpm build --filter docs
  ```

- **只构建插件包**:
  ```bash
  pnpm build --filter strapi-plugin-bag
  ```

## 任务编排 (turbo.json) 详解

本项目的 `turbo.json` 位于根目录，它定义了整个工作区的任务拓扑结构和缓存策略。以下是各项配置的深度解析：

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    // 1. 构建任务 (build)
    "build": {
      // 依赖声明：运行自己的构建前，必须先完成所有上游依赖项的构建 (^ 表示上游)
      "dependsOn": ["^build"],
      // 输入限制：只有当默认文件或 .env 环境变量变化时，才失效缓存
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      // 产物缓存：指定构建生成的目录，Turbo 会自动缓存这些目录以供下次跳过构建
      "outputs": [
        "dist/**", // 插件包编译产物
        "build/**", // Strapi 后端产物
        ".vitepress/dist/**" // 文档静态产物
      ]
    },

    // 2. 代码校验 (lint)
    "lint": {
      // 同样先运行上游依赖的校验（如果有）
      "dependsOn": ["^lint"],
      "outputs": []
    },

    // 3. 类型检查 (check-types)
    "check-types": {
      "dependsOn": ["^check-types"],
      "outputs": []
    },

    // 4. 开发模式 (dev / develop)
    "dev": {
      // 关闭缓存：开发模式下代码实时变动，不应命中缓存
      "cache": false,
      // 持久化：开发服务器是长驻进程，不会自动退出
      "persistent": true
    },
    "develop": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 配置项关键字段说明：

| 字段           | 作用                                                                                                          |
| :------------- | :------------------------------------------------------------------------------------------------------------ |
| **dependsOn**  | 定义任务的执行顺序。`^` 符号表示“上游依赖包的任务”，比如 `docs` 依赖 `plugin`，则会先运行 `plugin` 的 build。 |
| **outputs**    | 指定哪些文件夹会被 Turbo 压缩并存入缓存。下次运行如果输入没变，Turbo 会直接把这些文件“变”出来。               |
| **inputs**     | 定义哪些文件的改动会影响缓存结果。默认包括该包下的所有源文件。                                                |
| **cache**      | 是否开启任务缓存。通常构建类任务开启，启动类（dev）任务关闭。                                                 |
| **persistent** | 标识是否为监听模式的长驻任务。这能让 Turbo 正确处理多任务并行时的日志输出。                                   |

## 缓存管理

Turborepo 会将构建产物缓存在根目录的 `.turbo` 文件夹中。

- **命中缓存**：如果您没改代码再次运行 `build`，您会发现任务在几毫秒内就完成了，并显示 `FULL TURBO`。
- **强制刷新**：如果您想跳过缓存强制重新运行，可以删除 `.turbo` 目录，或者运行：
  ```bash
  pnpm build --force
  ```

## 软链接与包管理 (PNPM Workspaces)

在 Monorepo 结构中，`apps/backend`（Strapi 应用）是如何能够实时访问到 `packages/strapi-plugin-bag`（插件源码）的？这得益于 **PNPM Workspaces** 的软链接（Symbolic Link）机制。

### 1. 声明工作区

在根目录的 `pnpm-workspace.yaml` 中，我们定义了哪些目录属于工作区：

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 2. 引用本地包

在 `apps/backend/package.json` 中，我们通过 `workspace:*` 协议引用了插件包：

```json
{
  "dependencies": {
    "strapi-plugin-bag": "workspace:*"
  }
}
```

### 3. 原理解析

当您在根目录运行 `pnpm install` 时，PNPM 不会从 NPM 远程仓库下载 `strapi-plugin-bag`，而是：

- 在 `apps/backend/node_modules/` 下创建一个名为 `strapi-plugin-bag` 的**符号链接（软链接）**。
- 该链接直接指向 `packages/strapi-plugin-bag/` 物理目录。

这意味着：

- **实时同步**：您在 `packages/` 下修改的代码，`apps/` 下会立即感知到。
- **无需重复安装**：所有包共享同一个 `pnpm-lock.yaml`，极大节省磁盘空间并保证版本一致。

### 4. 为什么 Strapi 能识别？

Strapi 在启动时会扫描 `node_modules`。由于 PNPM 已经在 `node_modules` 中建立了软链接，Strapi 会将其视为一个普通的已安装插件。

配合我们在 `apps/backend/config/plugins.js` 中的配置：

```javascript
module.exports = () => ({
  "strapi-plugin-bag": {
    enabled: true,
  },
});
```

Strapi 就能完美加载这个处于开发中的本地插件。

### 5. 注意事项：热更新

虽然文件是链接过去的，但 Strapi 的 Admin UI 需要经过 Vite 编译。

- **服务端代码**：修改 `packages/` 下的 `server/` 代码，Strapi 也会触发热重启。
- **管理后台代码**：修改 `admin/` 代码，由于使用了 Turbo 的 `dev` 任务，Vite 会监听变化并自动重新编译插件的 `dist` 目录，从而实现 Admin 界面的实时预览。
