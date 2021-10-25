import { Main } from './main';
// import { getAsyncData } from './config';
class EntryClient extends Main {
	public constructor() {
		super();
		this.initState();
	}
	public async initState() {
		// replaceStore(this.store);
	}

	// 注册路由钩子
	public registerRouterHook() {
		this.router.afterEach(() => {
			console.log('数据预取');
			// const { router, store } = this;
			// getAsyncData(router, store, false);
			// window.$getPageData = () => getAsyncData(router, store, false);
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
	}
}
