import { Router, RouteLocation } from 'vue-router';
import { BaseStore } from '@/store';
import { Component } from 'vue';
import { setCookies } from '@/utils/cookies';
import { StateFromNativeResponse } from '@/services/native';

/**
 * 客户端&服务端逻辑大全
 */

// 特殊字符连接的字符串转成数组
export const getUrlQuery = (str: string): Record<string, any> => {
	if (!str) return {};
	const arr = str.split('&');
	const querys = {};
	arr.forEach((i: string) => {
		const keyVal = i.split('=');
		return Object.assign(querys, {
			[keyVal[0]]: keyVal[1],
		});
	});
	return querys;
};

type Querys = {
	v?: string;
} & StateFromNativeResponse['data'];

// 转换url - 客户端
export const getRealUrl = (router: Router) => {
	if (typeof window === undefined) return;
	const { pathname, hash, search } = window.location;
	const query1 = getUrlQuery(hash.replace(/^#/, ''));
	const query2 = getUrlQuery(search.replace(/^\?/, ''));
	const querys: Querys = Object.assign(query1, query2) as Querys;

	router.replace({
		path: pathname,
		query: { ...querys },
	});
	// 获取重要参数配置进行存储
	const { v, token, platform, channel, vid, app_id } = querys;
	if (v) {
		window.$app_v = v;
	}
	// 同步url后状态
	setCookies({ token, platform, channel, vid, app_id });
	return;
};

// 客户端接管store
export const replaceStore = (store: BaseStore) => {
	// 接管服务端状态
	if (typeof window === 'undefined') return;
	const { __INIT_STATE__ } = window;
	let status = 0;
	if (__INIT_STATE__ && __INIT_STATE__.subList.length) {
		__INIT_STATE__.subList.forEach((item) => {
			const { path, params, param } = item;
			// 如有服务端请求失败接口，则重刷
			if (param && param.code && param.code !== 0) {
				status = 1;
				return;
			}
			const paths = path.split('.');
			let target: any = store;
			const len = paths.length - 1;
			paths.slice(0, len).forEach((key) => {
				if (!key) return;
				target = target[key];
			});
			if (!target) {
				return (store as any)[paths[len]](...params);
			}
			target[paths[len]](...params);
		});

		if (status) {
			window.$getPageData();
		}
		window.__INIT_STATE__.subList = [];
	}
};

// 执行注册store钩子
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

// 预取数据
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

// ssr自定义钩子
export const getAsyncData = (
	router: Router,
	store: BaseStore,
	isServer: boolean,
	reqConfig?: ReqConfig
): Promise<void> => {
	return new Promise(async (resolve) => {
		const { matched, fullPath, query } = router.currentRoute.value;

		// 当前组件
		const components: Component[] = matched.map((i) => {
			return i.components.default;
		});
		// 动态注册store
		registerModules(components, router, store, isServer, reqConfig);

		const { pd } = query;

		// 是否为服务端渲染初始页面
		const isServerPage = store.ssrPath === fullPath;

		// 预取数据
		if ((isServer && Number(pd)) || (!isServer && !isServerPage)) {
			await prefetchData(components, router, store, isServer);
		}
		// 干掉预取数据标识
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
		$app_v: string;
		__INIT_STATE__: BaseStore;
		__APP_CONFIG__: {
			VITE_BASE_URL: string;
			VITE_BASE_H5_URL: string;
			VITE_BASE_VIP: string;
			VITE_BASE_DISTRIBUTION: string;
			VITE_BASE_HOTEL: string;
			VITE_BASE_TRAIN: string;
			VITE_BASE_TAXI: string;
			VITE_BASE_INVOICE: string;
			VITE_BASE_FLIGHT: string;
			VITE_BASE_TAKE_OUT: string;
		};
	}
}
