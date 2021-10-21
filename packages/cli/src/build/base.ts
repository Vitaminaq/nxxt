import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueLegacy from '@vitejs/plugin-legacy';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { NxxtUserConfig, mergePwa, mergePxToRem, mergeCompilerOptions } from '../config';

export const getBaseOptions = (options: NxxtUserConfig): UserConfig => {
    const { pwa, jsx, pxToRem, legacy, alias = {}, compilerOptions, viteOptions } = options;
    const baseOptions = { ...viteOptions }
    let { plugins = [], esbuild = {}, resolve = {}, css = {} } = baseOptions;
    plugins = [
        ...plugins,
        vue({
            template: {
                compilerOptions: compilerOptions ? mergeCompilerOptions(compilerOptions) : {} as any
            }
        })
    ]
    legacy && plugins.push(
        vueLegacy({
            targets: ['defaults'],
        })
    )
    jsx && plugins.push(vueJsx());
    pwa && plugins.push(VitePWA(mergePwa(pwa)));

    baseOptions.plugins = plugins;

    baseOptions.resolve = {
        ...resolve,
        alias: {
            ...resolve.alias,
            '@': path.resolve(process.cwd(), './src'),
            ...alias
        }
    }

    pxToRem && (baseOptions.css = {
        ...css,
        postcss: {
            plugins: [
                require('postcss-pxtorem')(mergePxToRem(pxToRem)),
            ],
        },
    });
    jsx && (baseOptions.esbuild = {
        ...esbuild,
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
    })
    return baseOptions;
}
