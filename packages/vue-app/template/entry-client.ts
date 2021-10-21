import { Main } from './main';
import VueRescroll from '@wefly/vue-rescroll';
import VueImageLazyLoad from '@wefly/vue-image-lazy-load';
import { getRealUrl, getAsyncData } from '@/services/publics';
import { getStateFromNative, getSyncWxState } from '@/services/native';
import Popup from '@/components/popup';
import { getSyncAppState, setNativeTitle } from '@/utils/native-methods';
import { setCookies } from '@/utils/cookies';

class EntryClient extends Main {
	public constructor() {
		super();
		this.initState();
	}
	public async initState() {
		replaceStore(this.store);
	}

	// 注册路由钩子
	public registerRouterHook() {
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
	}
}
