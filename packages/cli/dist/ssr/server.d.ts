/// <reference types="node" />
import { Express } from 'express';
import { SSR } from './ssr';
export declare class Server {
    ssr: SSR;
    app: Express;
    constructor(ssr: SSR);
    middleware(): Promise<void>;
    registerRoute(): void;
    listen(): import("http").Server;
}
