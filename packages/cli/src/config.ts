import {
  InlineConfig,
  AliasOptions,
  UserConfig,
  mergeConfig,
} from "vite";
import { Options } from "vite-plugin-pwa";
import { getTypeFile, resolveModule } from "./utils";
// import { template as vueTemplate } from '@nxxt/vue-app';

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
  // resolveVueTemplate(vueTemplate.dir, './entry-server.ts');
};

export const getClientEntry = (): string => {
  return getTypeFile("src/entry-client") as string;
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

  viteOptions = mergeConfig(viteOptions || {}, buildConfig);

  serverEntry = serverEntry || getServerEntry() || '';

  return {
    ...nxxtConfig,
    viteOptions,
    serverEntry,
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
