import { getClientOptions } from './client';
import { getServerOptions } from './server';

export const getBaseBuildConfig = (customConfig: any) => {
    return {
        clientOptions: getClientOptions(customConfig),
        serverOptions: getServerOptions(customConfig)
    }
}

