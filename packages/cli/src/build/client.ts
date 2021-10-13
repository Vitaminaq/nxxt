import { getBaseOptions } from './base';
import { UserConfig } from 'vite';

export const getClientOptions = (options: any): UserConfig => {
    const baseOptions = getBaseOptions(options)
    return {
        ...baseOptions,
        build: {
            ...baseOptions.build,
            ssrManifest: true,
            outDir: 'dist/client'
        }
    }
}
