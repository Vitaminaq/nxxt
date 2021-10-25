import { createApp, createSSRApp, App, Component } from 'vue';
import { createMemoryHistory, createWebHistory } from 'vue-router';

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
