import { createApp, createSSRApp, App, Component } from 'vue';
import { createMemoryHistory, createWebHistory } from 'vue-router';

export interface Config {
	base_h5: string;
	base_url: string;
	base_vip: string;
	base_distribution: string;
	base_hotel: string;
	base_train: string;
	base_taxi: string;
	base_invoice: string;
	base_flight: string;
	base_take_out: string;
}

// ssr模式永远指向线上环境 csr则不受影响
const envs = import.meta.env;

let appConfig = envs;

if (typeof process !== 'undefined') {
	appConfig = process.env as any;
}

if (typeof window !== 'undefined' && window.__APP_CONFIG__) {
	appConfig = window.__APP_CONFIG__ as any;
}

const {
	VITE_BASE_URL,
	VITE_BASE_H5_URL,
	VITE_BASE_VIP,
	VITE_BASE_DISTRIBUTION,
	VITE_BASE_HOTEL,
	VITE_BASE_TRAIN,
	VITE_BASE_TAXI,
	VITE_BASE_INVOICE,
	VITE_BASE_FLIGHT,
	VITE_BASE_TAKE_OUT,
} = appConfig;

export const config: Config = {
	base_h5: VITE_BASE_H5_URL,
	base_url: VITE_BASE_URL,
	base_vip: VITE_BASE_VIP,
	base_distribution: VITE_BASE_DISTRIBUTION,
	base_hotel: VITE_BASE_HOTEL,
	base_train: VITE_BASE_TRAIN,
	base_taxi: VITE_BASE_TAXI,
	base_invoice: VITE_BASE_INVOICE,
	base_flight: VITE_BASE_FLIGHT,
	base_take_out: VITE_BASE_TAKE_OUT,
};

// 是否为SSR模式
export const isSSR = import.meta.env.SSR;

// 根据模式导出构造函数
export const _createApp = (root: Component): App => {
	return isSSR ? createSSRApp(root) : createApp(root);
};

// 根据模式导出路由模式
export const routerHistory = () => {
	return isSSR ? createMemoryHistory() : createWebHistory();
};
