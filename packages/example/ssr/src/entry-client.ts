import { Main } from './main';
import VueRescroll from '@wefly/vue-rescroll';
import VueImageLazyLoad from '@wefly/vue-image-lazy-load';
import { getRealUrl } from '@/services/publics';
import { getStateFromNative, getSyncWxState } from '@/services/native';
import { getSyncAppState, setNativeTitle } from '@/utils/native-methods';
import { setCookies } from '@/utils/cookies';
import { getAsyncData } from 'nxxt';

class EntryClient extends Main {
	public constructor() {
		super();
		// 注册组件
		this.app.use(VueRescroll).use(VueImageLazyLoad);
		this.initState();
	}
	// 初始客户端状态
	public async initState() {
		const { router, app, store } = this;
		// 由于小程序的特殊性，先拦截hash
		getSyncWxState(router, app, store);
		// 接管路由-替换参数
		getRealUrl(router);

		this.registerRouterHook();

		// 先同步原生状态，再mounted，保证参数齐全
		await this.getSyncAppState();
		this.onReady();
		// 接管store - 动态注册store暂不接管
		// replaceStore(this.store);
	}
	public async getSyncAppState() {
		const r = await getSyncAppState();
		if (r.code !== 0) return;
		setCookies(r.data);
	}
	// app向h5同步状态
	public setSyncAppState(state: any) {
		const { app, store } = this;
		return getStateFromNative(state, app, store);
	}

	// 注册路由钩子
	public registerRouterHook() {
		this.router.beforeEach((to, from, next) => {
			const { query, meta } = to;
			const { title } = meta as any;
			if (title) {
				document.title = title;
				// 设置ios标题
				setNativeTitle({
					title,
				});
			}
			const { v } = query;
			const { $app_v } = window;
			if (!v && $app_v) {
				next({
					name: to.name || 'home',
					query: {
						...to.query,
						v: $app_v,
					},
				});
			} else {
				next();
			}
		});
		this.router.afterEach(() => {
			const { router, store } = this;
			getAsyncData(router, store, false);
			window.$getPageData = () => getAsyncData(router, store, false);
		});
	}

	public async onReady() {
		// 挂载节点
		const { router } = this;
		await router.isReady();
		this.app.mount('#app');
		window.nxxt = this;
	}
}

new EntryClient();

declare global {
	interface Window {
		nxxt: EntryClient;
		$getPageData: () => Promise<any>;
		wx: any;
	}
}
