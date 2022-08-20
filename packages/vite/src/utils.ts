import * as vite from 'vite';
// import type { ResolvedOptions } from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import type { InlineConfig, SSROptions } from 'vite'

export interface ViteOptions extends InlineConfig {
    vue?: any
    ssr?: SSROptions
}

export interface ViteBuildContext {
    npxt: any
    config: ViteOptions
    clientServer?: vite.ViteDevServer
    ssrServer?: vite.ViteDevServer
}


export const mergeNpxtConfig = (npxt: any) => {
    const ctx: ViteBuildContext = {
        npxt,
        config: vite.mergeConfig(
          {
            resolve: {
              alias: {
                ...npxt.alias
              }
            },
            plugins: [
              replace({
                ...Object.fromEntries([';', '(', '{', '}', ' ', '\t', '\n'].map(d => [`${d}global.`, `${d}globalThis.`])),
                preventAssignment: true
              }),
            ]
          } as ViteOptions,
          npxt.vite
        )
    }
    return ctx;
}