import { RouterView } from 'vue-router';
import { h, defineComponent } from 'vue';
import { replaceStore, RegisterModuleOption } from '@/services/publics';
import BaseStore from '@/store/index';

// 动态注册store module
export const baseRouteView = (storeModule: any) => {
	const routeView = {
		name: 'BaseRouteView',
		setup() {
			return () => h(RouterView);
		},
		registerModule({ store, reqConfig }: RegisterModuleOption) {
			const name: keyof BaseStore = storeModule.default.moduleName;

			// 接管服务端状态
			if (!store[name]) {
				store.addMoudle(name, new storeModule.default(reqConfig));
				replaceStore(store);
			}
		},
	};
	return routeView;
};

// 不需要动态注册时使用
export const baseRouteViewComponent = defineComponent({
	name: 'BaseRouteView',
	setup() {
		return () => h(RouterView);
	},
});
