import typescript from '@rollup/plugin-typescript'
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import path from 'path';

export default {
    input: {
        cli: path.resolve(__dirname, 'src/cli.ts')
    },
    plugins: [
        getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
        }),
        typescript({
            target: 'es2019',
            include: ['src/**/*.ts', 'types/**'],
            esModuleInterop: true,
            // in production we use api-extractor for dts generation
            // in development we need to rely on the rollup ts plugin
            tsconfig: 'tsconfig.base.json',
            declaration: true,
            declarationDir: path.resolve(__dirname, 'dist/')
          }),
          clear({
            targets: [ './dist' ]
         }),
    ],
    output: {
        dir: path.resolve(__dirname, 'dist'),
        entryFileNames: `[name].js`,
        exports: 'named',
        format: 'cjs',
        externalLiveBindings: false,
        freeze: false,
    },
}