module.exports = {
  apps: [
    {
      name: 'simple-cms',
      cwd: __dirname,
      script: 'npm',
      args: 'run preview -- --host 0.0.0.0 --port 4173',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4173,
      },
    },
  ],
};
