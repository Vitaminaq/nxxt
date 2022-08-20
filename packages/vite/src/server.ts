import { mergeConfig, build, createServer } from 'vite';
import type { InlineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import viteJsxPlugin from '@vitejs/plugin-vue-jsx'

export async function buildServer(ctx: any) {
    const serverConfig: InlineConfig = mergeConfig(ctx.config, {
        define: {
            'process.server': true,
            'process.client': false,
            'typeof window': '"undefined"',
            'typeof document': '"undefined"',
            'typeof navigator': '"undefined"',
            'typeof location': '"undefined"',
            'typeof XMLHttpRequest': '"undefined"'
        },
        plugins: [
            vuePlugin(ctx.config.vue),
            viteJsxPlugin()
        ]
    });

    // Production build
    if (!ctx.nuxt.options.dev) {
        // const start = Date.now()
        // logger.info('Building server...')
        await build(serverConfig)
        // await onBuild()
        // logger.success(`Server built in ${Date.now() - start}ms`)
        return
    }

    if (!ctx.nuxt.options.ssr) {
        // await onBuild()
        return
    }

    // dev
    const viteServer = await createServer(serverConfig);

    ctx.ssrServer = viteServer
}