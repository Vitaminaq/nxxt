import { Router, RouteLocation } from 'vue-router';
import { Component } from 'vue';
declare type BaseStore = any;
export declare const registerModules: (components: Component[], router: Router, store: BaseStore, isServer: boolean, reqConfig?: ReqConfig | undefined) => void;
export declare const prefetchData: (components: Component[], router: Router, store: BaseStore, isServer: boolean) => Promise<any[]>;
export interface ReqConfig {
    v: string;
    token: string;
    platform: 'ios' | 'android' | 'mini';
    channel: string;
    vid: string;
    app_id: string;
}
export declare const getAsyncData: (router: Router, store: BaseStore, isServer: boolean, reqConfig?: ReqConfig | undefined) => Promise<void>;
export interface AsyncDataOption {
    route: RouteLocation;
    store: BaseStore;
    router: Router;
    isServer: boolean;
    reqConfig?: ReqConfig;
}
export interface RegisterModuleOption extends AsyncDataOption {
    reqConfig: ReqConfig;
}
declare module '@vue/runtime-core' {
    interface ComponentCustomOptions {
        asyncData?: (option: AsyncDataOption) => void;
        registerModule?: (option: RegisterModuleOption) => void;
    }
    interface ComponentCustomProperties {
        asyncData?: (option: AsyncDataOption) => void;
        registerModule?: (option: RegisterModuleOption) => void;
    }
}
declare global {
    interface Window {
        __INIT_STATE__: BaseStore;
    }
}
export {};
