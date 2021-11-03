import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import clear from "rollup-plugin-clear";
import path from "path";

const plugins = [
  typescript({
    target: "es2019",
    include: ["src/**/*.ts", "types/**"],
    esModuleInterop: true,
    tsconfig: "tsconfig.base.json",
    declaration: true,
    declarationDir: path.resolve(__dirname, "dist/"),
  }),
  babel({
    babelHelpers: "bundled",
    presets: ["@babel/preset-env"],
  }),
];

const cjs = {
  input: {
    index: path.resolve(__dirname, "src/index.ts"),
    cli: path.resolve(__dirname, "src/cli.ts"),
  },
  plugins,
  output: {
    dir: path.resolve(__dirname, "dist"),
    entryFileNames: '[name].js',
    exports: "named",
    format: "cjs",
    externalLiveBindings: false,
    freeze: false,
  },
};

const mjs = {
  input: path.resolve(__dirname, "src/index.ts"),
  plugins: [
    ...plugins,
    clear({
      targets: ["./dist"],
    }),
  ],
  output: {
    file: "dist/index.mjs",
    exports: "named",
    format: "esm",
    externalLiveBindings: false,
    freeze: false,
  },
};

export default [cjs, mjs];
