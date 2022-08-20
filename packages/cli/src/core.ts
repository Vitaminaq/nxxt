import { createHooks } from 'hookable';

interface NpxtHooks {
    'close': (npxt: any) => any;
}

export async function createNuxt() {
    const hooks = createHooks<NpxtHooks>();

    const npxt = {
        hooks,
        callHook: hooks.callHook,
        addHooks: hooks.addHooks,
        hook: hooks.hook
    }
    return npxt;
}