import { mergeConfig, createServer } from 'vite';
import vuePlugin from '@vitejs/plugin-vue'
import viteJsxPlugin from '@vitejs/plugin-vue-jsx'
import type { InlineConfig } from 'vite';
import type { ViteOptions } from './utils';
import { mergeNpxtConfig } from './utils';

export async function buildClient (nuxt: any) {
    const ctx = mergeNpxtConfig(nuxt);
    const clientConfig: InlineConfig = mergeConfig(ctx.config, {
        define: {
          'process.server': false,
          'process.client': true,
          'module.hot': false
        },
        build: {
          ssrManifest: true,
          outDir: 'dist/client'
        },
        plugins: [
          vuePlugin(ctx.npxt.vue),
          viteJsxPlugin()
        ],
        server: {
          middlewareMode: true
        }
      } as ViteOptions);
      const viteServer = await createServer(clientConfig)
      return viteServer;
}