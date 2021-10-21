import { getBaseOptions } from './base';
import { UserConfig } from 'vite';
import { NxxtUserConfig } from '../config';

export const getClientOptions = (options: NxxtUserConfig): UserConfig => {
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
