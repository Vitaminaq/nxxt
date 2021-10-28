export declare const resolveModule: (p: string) => any;
export declare const resolveVueTemplate: (p: string, n: string) => any;
export declare const resolve: (p: string) => string;
export declare const getTemplate: (p: string) => string;
export declare const getTypeFile: (p: string) => string | null;
export declare const getDirFiles: (folderName: string) => string[];
export declare function getMemoryUsage(): {
    heap: number;
    rss: number;
};
export declare function getFormattedMemoryUsage(): string;
export declare function showBanner(nxxt: any): void;
