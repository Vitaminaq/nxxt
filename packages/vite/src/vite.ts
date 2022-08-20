import * as vite from 'vite';
import type { Options } from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import type { InlineConfig, SSROptions } from 'vite'
import { buildServer } from './server';
import { buildClient } from './client';

export interface ViteOptions extends InlineConfig {
    vue?: Options
    ssr?: SSROptions
}

export interface ViteBuildContext {
    npxt: any
    config: ViteOptions
    clientServer?: vite.ViteDevServer
    ssrServer?: vite.ViteDevServer
  }

export async function initVite(npxt: any) {
    const ctx: ViteBuildContext = {
        npxt,
        config: vite.mergeConfig(
          {
            resolve: {
              alias: {
                ...npxt.options.alias
              }
            },
            plugins: [
              replace({
                ...Object.fromEntries([';', '(', '{', '}', ' ', '\t', '\n'].map(d => [`${d}global.`, `${d}globalThis.`])),
                preventAssignment: true
              }),
            ]
          } as ViteOptions,
          npxt.viteOptions
        )
    }

    await buildClient(ctx)
    await buildServer(ctx)
}