import { getBaseOptions } from './base';
import { UserConfig } from 'vite';
import { NxxtUserConfig } from '../config';

export const getServerOptions = (options: NxxtUserConfig): UserConfig => {
    const baseOptions = getBaseOptions(options);
    return {
        ...baseOptions,
        build: {
            ...baseOptions.build,
            ssr: options.serverEntry,
            outDir: 'dist/server'
        } 
    }
}
