import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import path from 'path';

export default {
    input: {
      index: path.resolve(__dirname, 'src/index.ts'),
      cli: path.resolve(__dirname, 'src/cli.ts')
    },
    plugins: [
        typescript({
            target: 'es2019',
            include: ['src/**/*.ts', 'types/**', 'node_modules/vite/client'],
            esModuleInterop: true,
            tsconfig: 'tsconfig.base.json',
            declaration: true,
            declarationDir: path.resolve(__dirname, 'dist/')
          }),
          babel({
            babelHelpers: 'bundled',
            presets: ["@babel/preset-env"]
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