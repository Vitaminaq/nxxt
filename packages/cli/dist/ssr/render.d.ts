import { App, VNode, RendererNode, RendererElement } from 'vue';
export declare class Render {
}
export declare const renderHtml: (app: App<any> | VNode<RendererNode, RendererElement>, manifest: any) => Promise<{
    rootHtml: string;
    preloadLinks: string;
}>;
export declare const renderPreloadLinks: (modules: Set<string>, manifest: {
    [key: string]: string[];
}) => string;
export declare const renderPreloadLink: (file: string) => string;
