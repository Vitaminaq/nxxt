import { Router, RouteLocation } from 'vue-router';
// import { BaseStore } from '@/store';
import { Component } from 'vue';
import {} from '@vue/runtime-core';

type BaseStore = any;

// register store modules hook
export const registerModules = (
	components: Component[],
	router: Router,
	store: BaseStore,
	isServer: boolean,
	reqConfig?: ReqConfig
) => {
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
export const prefetchData = (
	components: Component[],
	router: Router,
	store: BaseStore,
	isServer: boolean
) => {
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

export interface ReqConfig {
	v: string;
	token: string;
	platform: 'ios' | 'android' | 'mini';
	channel: string;
	vid: string;
	app_id: string;
}

// ssr custom hook
export const getAsyncData = (
	router: Router,
	store: BaseStore,
	isServer: boolean,
	reqConfig?: ReqConfig
): Promise<void> => {
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

export interface AsyncDataOption {
	route: RouteLocation;
	store: BaseStore;
	router: Router;
	isServer: boolean;
	reqConfig?: ReqConfig;
}

export interface RegisterModuleOption extends AsyncDataOption {
	reqConfig: ReqConfig;
}

declare module '@vue/runtime-core' {
	export interface ComponentCustomOptions {
		asyncData?: (option: AsyncDataOption) => void;
		registerModule?: (option: RegisterModuleOption) => void;
	}
	export interface ComponentCustomProperties {
		asyncData?: (option: AsyncDataOption) => void;
		registerModule?: (option: RegisterModuleOption) => void;
	}
}

declare global {
	interface Window {
		__INIT_STATE__: BaseStore;
	}
}
