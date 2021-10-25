import { createRouter as _createRouter, RouteRecordRaw } from 'vue-router';
import { routerHistory } from './config';

const pages = import.meta.globEager('../modules/*/router/**');

const routes: RouteRecordRaw[] = [];

Object.keys(pages).map((path) => {
	Array.prototype.push.apply(routes, pages[path].default);
});

export function createRouter() {
	return _createRouter({
		history: routerHistory(),
		routes,
	});
}
