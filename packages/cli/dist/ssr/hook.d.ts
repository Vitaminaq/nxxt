import { Router } from 'vue-router';
import { Component } from 'vue';
declare type Store = {
    ssrPath: string;
    $setSsrPath: (p: string) => void;
};
declare type ReqConfig = {};
export declare const registerModules: (components: Component[], router: Router, store: Store, isServer: boolean, reqConfig?: ReqConfig | undefined) => void;
export declare const prefetchData: (components: Component[], router: Router, store: Store, isServer: boolean) => Promise<any[]>;
export declare const getAsyncData: (router: Router, store: Store, isServer: boolean, reqConfig?: ReqConfig | undefined) => Promise<void>;
export {};
