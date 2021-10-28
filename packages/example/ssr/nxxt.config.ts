import { defineNxxtConfig } from 'nxxt';
import path from 'path';

export default defineNxxtConfig({
    port: 8090, // ssr服务器启动端口
    jsx: true, // 是否支持jsx语法
    compilerOptions: {
        runtimeDirective: ['img-lazy-load', 'rescroll'], // runtime 自定义指令
        customElement: ['wx-open-launch-weapp'] // 自定义元素
    },
    alias: { // 别名
        '@src': path.resolve(__dirname, './src')
    },
    pxToRem: { // 是否开启px to rem
        rootValue: 37.5,
        propList: ['*']
    },
    pwa: true, // 是否开启pwa
    legacy: true
});