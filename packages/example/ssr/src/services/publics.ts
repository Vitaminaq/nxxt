import { Router } from 'vue-router';
import { BaseStore } from '@/store';
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

export interface ReqConfig {
	token?: string;
	v?: string;
}

declare global {
	interface Window {
		__INIT_STATE__: BaseStore;
		$app_v: string;
		__APP_CONFIG__: {
			VITE_BASE_URL: string;
			VITE_BASE_H5_URL: string;
		};
	}
}
