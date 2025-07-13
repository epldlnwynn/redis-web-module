import { defineConfig } from 'umi';

export default defineConfig({
    define: {
        "process.env.UMI_ENV": "prod",
        "process.env.server_url": "/api/redis/"
    },
    analytics: {
        //baidu: "a7511d1e65fc1fd934051937f13b15ce",
        //ga_v2: 'G-abcdefg', // google analytics 的 key (GA 4)
        //ga: 'ga_old_key', // 若你在使用 GA v1 旧版本，请使用 `ga` 来配置
    }
})
