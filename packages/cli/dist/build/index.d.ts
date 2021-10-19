import { getClientOptions } from './client';
import { getServerOptions } from './server';
export declare const getBaseBuildConfig: (customConfig: any) => {
    clientOptions: import("vite").UserConfig;
    serverOptions: import("vite").UserConfig;
};
export { getClientOptions, getServerOptions };
