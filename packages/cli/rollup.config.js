import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel';
// import commonjs from "@rollup/plugin-commonjs";
// import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import clear from 'rollup-plugin-clear';
import path from 'path';

export default {
    input: {
      cli: path.resolve(__dirname, 'src/cli.ts')
    },
    plugins: [
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
        //   resolve(),
        //   commonjs(),
          json(),
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