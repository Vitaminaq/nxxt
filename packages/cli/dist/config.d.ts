import { InlineConfig } from 'vite';
export declare const defaultNxxtConfigFile = "nxxt.config";
export interface NxxtConfig {
    mode?: string;
}
export declare const getNxxtConfig: () => NxxtConfig;
export declare const mergeConfig: (inlineConfig: InlineConfig) => {
    mode: string;
    configFile?: string | false | undefined;
    envFile?: false | undefined;
    root?: string | undefined;
    base?: string | undefined;
    publicDir?: string | false | undefined;
    cacheDir?: string | undefined;
    define?: Record<string, any> | undefined;
    plugins?: (import("vite").PluginOption | import("vite").PluginOption[])[] | undefined;
    resolve?: (import("vite").ResolveOptions & {
        alias?: import("vite").AliasOptions | undefined;
    }) | undefined;
    css?: import("vite").CSSOptions | undefined;
    json?: import("vite").JsonOptions | undefined;
    esbuild?: false | import("vite").ESBuildOptions | undefined;
    assetsInclude?: string | RegExp | (string | RegExp)[] | undefined;
    server?: import("vite").ServerOptions | undefined;
    build?: import("vite").BuildOptions | undefined;
    optimizeDeps?: import("vite").DepOptimizationOptions | undefined;
    logLevel?: import("vite").LogLevel | undefined;
    clearScreen?: boolean | undefined;
    envDir?: string | undefined;
    alias?: import("vite").AliasOptions | undefined;
    dedupe?: string[] | undefined;
};
