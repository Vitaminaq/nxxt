import { InlineConfig, AliasOptions, UserConfig } from "vite";
import { Options } from "vite-plugin-pwa";
export declare const defaultNxxtConfigFile = "nxxt.config";
export interface CompilerOptions {
    runtimeDirective?: string[];
    customDirective?: string[];
    customElement?: string[];
}
export declare type PxToRemOptions = {
    rootValue: number;
    propList: string[];
} | boolean;
export declare type PwaOptions = boolean | Partial<Options>;
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
export declare const defineNxxtConfig: (options: NxxtUserConfig) => NxxtUserConfig;
export declare const getNxxtConfig: () => NxxtUserConfig;
export declare const getServerEntry: () => string | null;
export declare const mergeNxxtConfig: (inlineConfig: InlineConfig) => NxxtUserConfig;
export declare const getSsrTransformCustomDir: (runTime?: boolean) => () => {
    props: never[];
    needRuntime: boolean;
};
export declare const mergeCompilerOptions: ({ runtimeDirective, customDirective, customElement, }: CompilerOptions) => {
    directiveTransforms: Record<string, any>;
    isCustomElement: (tag: string) => boolean;
};
export declare const mergePxToRem: (options: PxToRemOptions) => {
    rootValue: number;
    propList: string[];
};
export declare const mergePwa: (options: PwaOptions) => Partial<Options>;
