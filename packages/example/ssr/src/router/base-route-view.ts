import { RouterView } from 'vue-router';
import { h, defineComponent, ComponentOptionsWithoutProps } from 'vue';
import { replaceStore } from '@/services/publics';
import BaseStore from '@/store/index';

// 动态注册store module
export const baseRouteView = (storeModule: any): ComponentOptionsWithoutProps => {
	return defineComponent({
		name: 'BaseRouteView',
		setup() {
			return () => h(RouterView);
		},
		registerModule({ store, reqConfig }) {
			const name: keyof BaseStore = storeModule.default.moduleName;

			// 接管服务端状态
			if (!store[name]) {
				store.addMoudle(name, new storeModule.default(reqConfig));
				replaceStore(store);
			}
		},
	});
};

// 不需要动态注册时使用
export const baseRouteViewComponent = defineComponent({
	name: 'BaseRouteView',
	setup() {
		return () => h(RouterView);
	},
});
