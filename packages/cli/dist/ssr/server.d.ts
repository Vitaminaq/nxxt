/// <reference types="node" />
import { Express } from "express";
import { Render } from "./render";
export declare class Server {
    render: Render;
    app: Express;
    constructor(render: Render);
    middleware(): Promise<void>;
    registerRoute(): void;
    listen(): import("http").Server;
}
