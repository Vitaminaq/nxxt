import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import clear from "rollup-plugin-clear";
import path from "path";

const build = ({ name, format, isClear }) => {
  const plugins = [
    typescript({
      target: "es2019",
      include: ["src/**/*.ts", "types/**"],
      esModuleInterop: true,
      // in production we use api-extractor for dts generation
      // in development we need to rely on the rollup ts plugin
      tsconfig: "tsconfig.base.json",
      declaration: true,
      declarationDir: path.resolve(__dirname, "dist/"),
    }),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    })
  ];
  isClear && plugins.push(
    clear({
      targets: ["./dist"]
    }),
  );
  return {
    input: path.resolve(__dirname, `src/${name}.ts`),
    plugins: [
      typescript({
        target: "es2019",
        include: ["src/**/*.ts", "types/**"],
        esModuleInterop: true,
        // in production we use api-extractor for dts generation
        // in development we need to rely on the rollup ts plugin
        tsconfig: "tsconfig.base.json",
        declaration: true,
        declarationDir: path.resolve(__dirname, "dist/"),
      }),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
      }),
      clear({
        targets: ["./dist"],
      }),
    ],
    output: {
      dir: path.resolve(__dirname, "dist"),
      entryFileNames: `[name].js`,
      exports: "named",
      format,
      externalLiveBindings: false,
      freeze: false,
    },
  }
}

export default [{
  name: 'cli',
  format: 'cjs',
  isClear: true
}, {
  name: 'index',
  format: 'esm'
}].map(build)
