import { defineConfig } from 'umi';

const CompressionPlugin = require('compression-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production'
const title = "Redis databases";



export default defineConfig({
    title,
    outputPath: 'redis-module',
    hash: true,
    copy: [
        {from: "static", to: "static"}
    ],

    define: {
        "version": new Date().getTime(),
        "process.env.host": "https://redis.devhub.vip",
    },

    locale: {
        default: 'en-US', //默认语言 zh-CN
        baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
        antd: false, // 是否启用antd的<LocaleProvider />
        title: true,
        baseSeparator: '-',
    },

    antd: false,
    theme: false,

    nodeModulesTransform: {
        type: 'none',
    },

    headScripts: [],

    scripts: ['window.onresize()'],

    routes: [
        {
            path: "/",
            component: "@/layouts/BasicLayout",
            routes: [
                { path: "/", component: "@/pages/home/index" },
                { path: "/index.html", component: "@/pages/home/index" },
                { path: "/info/:id/:db/:type/:name", component: "@/pages/home/key" },

                { path: "/*", redirect: "/index.html", },
            ],
        },

    ],

    fastRefresh: {},

    manifest: {
        fileName: "manifest.json",
        writeToFileEmit: true,
    },

    dynamicImport: {
        loading: "@/components/loading-dynamic"
    },

    // 生产环境去除console日志打印
    terserOptions: {
        compress: {
            drop_console: isProd
        }
    },
    extraBabelPlugins: isProd ? ['babel-plugin-transform-remove-console'] : [],

    chainWebpack(memo, { env, webpack, createCSSRule }) {

        if (env == 'production') {

            memo.output
                .filename(`static/scripts/[id].[contenthash:8].js`)
                .chunkFilename(`static/scripts/[id].[contenthash:8].chunk.js`);

            // Css 压缩
            memo.plugin('extract-css').tap(options => {
                options[0].filename = 'static/css/[id].[contenthash:8].css'
                options[0].chunkFilename= 'static/css/[id].[contenthash:8].chunk.css'
                return options
            })

            // Gzip压缩
            memo.plugin('compression-webpack-plugin').use(CompressionPlugin, [
                {
                    test: /\.(js|css|png|svg)$/i, // 匹配
                    threshold: 10240, // 超过10k的文件压缩
                    deleteOriginalAssets: false, // 不删除源文件
                },
            ])

            //// 资源配置样板 https://blog.csdn.net/qq_39953537/article/details/107507724
            // UrlLoader
            memo.module
                .rule("images")
                .test(/\.(png|jpe?g|webp|gif|ico)(\?.*)?$/)
                .use("url-loader")
                .loader("url-loader")
                .tap(options => {
                    return {
                        ...options,
                        limit: 2000,
                        name: 'static/images/[name].[hash:8].[ext]',
                        fallback: {
                            ...options.fallback,
                            options: {
                                name: 'static/images/[name].[hash:8].[ext]',
                                esModule: false,
                            },
                        }
                    }
                })

            // FileLoader
            memo.module
                .rule("mp3")
                .test(/\.(mp3)?$/)
                .use("file-loader")
                .loader("file-loader")
                .tap(options => {
                    return {...options, name: 'static/audio/[name].[hash:8].[ext]'}
                })

            memo.plugins.delete("progress")
        } else {
            memo.module
                .rule("images")
                .test(/\.(png|jpe?g|webp|gif|ico)(\?.*)?$/)
                .use("url-loader")
                .loader("url-loader")
                .tap(options => {
                    return {
                        ...options,
                        limit: 2000,
                        name: 'static/images/[name].[hash:8].[ext]',
                        fallback: {
                            ...options.fallback,
                            options: {
                                name: 'static/images/[name].[hash:8].[ext]',
                                esModule: false,
                            },
                        }
                    }
                })
        }
    },

});
