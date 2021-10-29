import {
  InlineConfig,
  AliasOptions,
  UserConfig,
  mergeConfig,
} from "vite";
import { Options } from "vite-plugin-pwa";
import { getTypeFile, resolveModule, isExitFile, resolve } from "./utils";
import { template as vueTemplate } from '@nxxt/vue-app';

export const defaultNxxtConfigFile = "nxxt.config";

export interface CompilerOptions {
  runtimeDirective?: string[];
  customDirective?: string[];
  customElement?: string[];
}

export type PxToRemOptions =
  | {
      rootValue: number;
      propList: string[];
    }
  | boolean;

export type PwaOptions = boolean | Partial<Options>;

export interface NxxtUserConfig {
  root?: string;
  base?: string;
  mode?: string;
  port?: number;
  jsx?: boolean;
  legacy?: boolean;
  compilerOptions?: CompilerOptions;
  serverEntry?: string;
  alias?: AliasOptions;
  pxToRem?: PxToRemOptions;
  pwa?: PwaOptions;
  viteOptions?: UserConfig;
  defaultTemplateDir?: string;
}

export const defineNxxtConfig = (options: NxxtUserConfig): NxxtUserConfig => {
  return options;
};

export const getNxxtConfig = (): NxxtUserConfig => {
  if (!getTypeFile(defaultNxxtConfigFile)) return {};
  return resolveModule(`./${defaultNxxtConfigFile}`);
};

export const getServerEntry = () => {
  return getTypeFile("src/entry-server");
};

export const mergeNxxtConfig = (inlineConfig: InlineConfig): NxxtUserConfig => {
  const buildConfig = inlineConfig;
  const nxxtConfig = getNxxtConfig();

  let { viteOptions, serverEntry } = nxxtConfig;

  const mode = inlineConfig.mode || nxxtConfig.mode || "production";

  const { NODE_ENV } = process.env;

  if (!NODE_ENV || NODE_ENV !== mode) {
    process.env.NODE_ENV = mode;
  }
  
  buildConfig.mode = mode;

  serverEntry = serverEntry || getServerEntry() || '';

  let defaultTemplateDir = '';

  // custom index.html
  if (!isExitFile('index.html')) {
    const { dir } = vueTemplate;
    buildConfig.root = dir;
    defaultTemplateDir = dir;
    serverEntry = resolve('entry-server.ts', dir);
  }

  viteOptions = mergeConfig(viteOptions || {}, buildConfig);

  return {
    ...nxxtConfig,
    viteOptions,
    serverEntry,
    defaultTemplateDir
  };
};

export const getSsrTransformCustomDir = (runTime: boolean = false) => {
  return () => {
    return {
      props: [],
      needRuntime: runTime,
    };
  };
};

export const mergeCompilerOptions = ({
  runtimeDirective = [],
  customDirective = [],
  customElement = [],
}: CompilerOptions) => {
  const directiveTransforms: Record<string, any> = {};
  runtimeDirective.forEach((r) => {
    directiveTransforms[r] = getSsrTransformCustomDir(true);
  });
  customDirective.forEach((c) => {
    directiveTransforms[c] = getSsrTransformCustomDir();
  });
  return {
    directiveTransforms,
    isCustomElement: (tag: string) => {
      return customElement.includes(tag);
    },
  };
};

export const mergePxToRem = (options: PxToRemOptions) => {
  if (typeof options === "boolean")
    return {
      rootValue: 37.5,
      propList: ["*"],
    };
  return options;
};

export const mergePwa = (options: PwaOptions): Partial<Options> => {
  if (typeof options === "boolean")
    return {
      strategies: "generateSW",
      manifest: {},
      workbox: {
        cacheId: "nxxt",
        sourcemap: false,
        globIgnores: ["node_modules/**", "*.js", "*.css"],
        globPatterns: [],
        runtimeCaching: [
          {
            urlPattern: /\/.*(\?|&)v=.*/,
            handler: "StaleWhileRevalidate",
          },
          {
            urlPattern: /\/api\/.*(\?|&)/,
            handler: "NetworkFirst",
          },
          {
            urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
            handler: "StaleWhileRevalidate",
          },
        ],
      },
    };
  return options;
};
