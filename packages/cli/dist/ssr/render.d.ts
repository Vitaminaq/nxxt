import { App, VNode, RendererNode, RendererElement } from "vue";
import { Request } from "express";
import { SSR } from "./ssr";
import { ViteDevServer } from "vite";
export declare class Render {
    ssr: SSR;
    devServer: ViteDevServer | null;
    constructor(ssr: SSR);
    init(): Promise<void>;
    renderHtml(req: Request): Promise<string | undefined>;
}
export declare const serverRender: (req: Request, main: any) => Promise<void>;
export declare const renderRootHtml: (app: App<any> | VNode<RendererNode, RendererElement>, manifest: any) => Promise<{
    rootHtml: string;
    preloadLinks: string;
}>;
export declare const renderPreloadLinks: (modules: Set<string>, manifest: {
    [key: string]: string[];
}) => string;
export declare const renderPreloadLink: (file: string) => string;
