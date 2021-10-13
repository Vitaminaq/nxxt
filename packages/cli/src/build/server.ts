import { getBaseOptions } from './base';
import { UserConfig } from 'vite';

export const getServerOptions = (options: any): UserConfig => {
    const baseOptions = getBaseOptions(options)
    return {
        ...baseOptions,
        build: {
            ...baseOptions.build,
            ssr: options.serverEntry,
            outDir: 'dist/server'
        } 
    }
}
