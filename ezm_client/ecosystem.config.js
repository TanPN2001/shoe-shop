module.exports = {
  apps: [
    {
      name: "ezm-client",
    //   cwd: "/Users/tanpn2001/Documents/personal/ezm_cms/ezm_client",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      autorestart: true,
      max_memory_restart: "1G",
      time: true
    }
  ]
};
