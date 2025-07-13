import { defineConfig } from 'umi';

export default defineConfig({
    mock: false,

    antd: false,

    define: {
        "process.env.UMI_ENV": "dev",
        "process.env.server_url": "http://127.0.0.1:63790/api/redis/"
    }
})
