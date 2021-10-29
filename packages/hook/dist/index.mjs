// register store modules hook
function registerModules(components, router, store, isServer, reqConfig) {
    return components
        .filter((i) => typeof i.registerModule === 'function')
        .forEach((component) => {
        component.registerModule({
            route: router.currentRoute,
            store,
            router,
            isServer,
            reqConfig,
        });
    });
}
// prefetch data hook
function prefetchData(components, router, store, isServer) {
    const asyncDatas = components.filter((i) => typeof i.asyncData === 'function');
    return Promise.all(asyncDatas.map((i) => {
        return i.asyncData({
            route: router.currentRoute.value,
            store,
            router,
            isServer,
        });
    }));
}
// ssr custom hook
function getAsyncData(router, store, isServer, reqConfig) {
    return new Promise(async (resolve) => {
        const { matched, fullPath, query } = router.currentRoute.value;
        // current components
        const components = matched.map((i) => {
            return i.components.default;
        });
        // register store module
        registerModules(components, router, store, isServer, reqConfig);
        const { pd } = query;
        const isServerPage = store.ssrPath === fullPath;
        // prefetch data
        if ((isServer && Number(pd)) || (!isServer && !isServerPage)) {
            await prefetchData(components, router, store, isServer);
        }
        !isServer && store.ssrPath && store.$setSsrPath('');
        resolve();
    });
}

export { getAsyncData, prefetchData, registerModules };
