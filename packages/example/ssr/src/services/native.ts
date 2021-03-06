import { App } from 'vue';
import { setCookies, exitSetCookies, removeCookie } from '@/utils/cookies';
import { getUrlQuery } from './publics';
import { Router } from 'vue-router';
import { isNative } from '@/utils/native-methods';
import BaseStore from '@/store/index';

export interface StateFromNativeData {
	token: string;
	platform: 'ios' | 'android' | 'mini';
	channel: string;
	vid: string;
	app_id: string;
}

export interface StateFromNativeResponse {
	code: 10000 | 10001 | 10002;
	data: StateFromNativeData;
}

/**
 * 接受来自原生的状态信息同步
 */
export const getStateFromNative = (
	r: StateFromNativeResponse,
	app: App,
	store: BaseStore
) => {
	console.log('从原生接受到的状态', r);
	const { data, code } = r;

	// 存储原生信息
	setCookies(data);

	switch (code) {
		// 正常打开webview
		case 10000:
			break;
		// h5跳登录返回
		case 10001:
			app.config.globalProperties.$popup.loading({
				title: '状态同步中',
				callback: () => {
					// 更新用户信息 - 自行实现
					return window.$getPageData();
				},
			});
			break;
		// 原生退出登录
		case 10002:
			removeCookie('token');
			break;
		default:
			break;
	}
};

// https://res.wx.qq.com/open/js/cloudbase/1.1.0/cloud.js
/**
 * 初始化微信环境，注入相关sdk
 */
export const initWxEnv = () => {
	const script = document.createElement('script');
	script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
	document.body.appendChild(script);
};

/**
 * 接受小程序刷新信号
 */
export const getSyncWxState = (router: Router, app: App, store: BaseStore) => {
	// 非服务端渲染/原生环境
	if (typeof window === undefined || isNative()) return;
	initWxEnv();
	window.addEventListener(
		'hashchange',
		() => {
			const { hash } = window.location;
			const { refresh, token, vid, channel, platform } = getUrlQuery(
				hash.replace(/^#/, '')
			);

			// 存储从小程序带过来的信息
			exitSetCookies({ token, vid, channel, platform });

			// 无refresh则不触发刷新
			if (!Number(refresh)) return;
			router.back();
			app.config.globalProperties.$popup.loading({
				title: '状态同步中',
				callback: () => {
					if (token) {
						// 更新用户信息 - 自行实现
					}
					return window.$getPageData();
				},
			});
		},
		false
	);
};
