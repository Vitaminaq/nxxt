import { Router } from 'vue-router';
import { Component } from 'vue';
declare type Store = {
    ssrPath: string;
    $setSsrPath: (p: string) => void;
};
declare type ReqConfig = {};
export declare function registerModules(components: Component[], router: Router, store: Store, isServer: boolean, reqConfig?: ReqConfig): void;
export declare function prefetchData(components: Component[], router: Router, store: Store, isServer: boolean): Promise<any[]>;
export declare function getAsyncData(router: Router, store: Store, isServer: boolean, reqConfig?: ReqConfig): Promise<void>;
export {};
