import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import clear from "rollup-plugin-clear";
import path from "path";

const build = (format) => {
  const plugins = [
    typescript({
      target: "es2019",
      include: ["src/**/*.ts"],
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
  const output = {
    exports: "named",
    format,
    externalLiveBindings: false,
    freeze: false,
  };
  if (format === "esm") {
    plugins.push(
      clear({
        targets: ["./dist"],
      })
    );
    output.file = `dist/index.mjs`;
  } else {
    output.dir = path.resolve(__dirname, 'dist');
		output.entryFileNames = `index.cjs`;
  }
  return {
    input: path.resolve(__dirname, `src/index.ts`),
    plugins,
    output
  }
};

const types = ["cjs", "esm"];

export default types.map(build);
