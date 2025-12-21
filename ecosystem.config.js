module.exports = {
  apps: [
    {
      name: "strapi-bag", // 进程名称，在 PM2 列表中显示的名称
      script: "pnpm", // 启动脚本命令
      args: "start", // 传递给脚本的参数，合起来就是 pnpm start
      cwd: "./apps/backend", // 当前工作目录，Strapi 应用实际所在的路径
      interpreter: "none", // 不使用特定的解释器，因为 pnpm 是 shell 命令
      env: {
        NODE_ENV: "production", // 生产环境标识
        PORT: 1339, // 指定生产环境运行端口
      },
      instances: 1, // 启动实例数量，单核服务器建议设为 1
      autorestart: true, // 程序崩溃时自动重启
      watch: false, // 生产环境关闭文件监听，防止频繁重启
      max_memory_restart: "1G", // 当内存占用超过 1G 时自动重启，防止内存泄漏
    },
  ],
};
