import { defineConfig } from 'umi';

export default defineConfig({
    mock: false,
    define: {
        "process.env.UMI_ENV": "test",
    }
})
