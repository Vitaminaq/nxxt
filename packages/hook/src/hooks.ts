import { Router } from 'vue-router';
import { Component } from 'vue';

// you can custom type
type Store = {
	ssrPath: string;
	$setSsrPath: (p: string) => void;
};
type ReqConfig = {};

// register store modules hook
export function registerModules (
	components: Component[],
	router: Router,
	store: Store,
	isServer: boolean,
	reqConfig?: ReqConfig
) {
	return components
		.filter((i: any) => typeof i.registerModule === 'function')
		.forEach((component: any) => {
			component.registerModule({
				route: router.currentRoute,
				store,
				router,
				isServer,
				reqConfig,
			});
		});
};

// prefetch data hook
export function prefetchData (
	components: Component[],
	router: Router,
	store: Store,
	isServer: boolean
) {
	const asyncDatas: any[] = components.filter(
		(i: any) => typeof i.asyncData === 'function'
	);
	return Promise.all(
		asyncDatas.map((i) => {
			return i.asyncData({
				route: router.currentRoute.value,
				store,
				router,
				isServer,
			});
		})
	);
};

// ssr custom hook
export function getAsyncData (
	router: Router,
	store: Store,
	isServer: boolean,
	reqConfig?: ReqConfig
): Promise<void> {
	return new Promise(async (resolve) => {
		const { matched, fullPath, query } = router.currentRoute.value;

		// current components
		const components: Component[] = matched.map((i) => {
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
};
