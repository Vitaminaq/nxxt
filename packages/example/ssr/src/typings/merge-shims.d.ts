import type { BaseStore } from '@/store';
import type { ReqConfig } from '@/services/publics';

declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		$store: BaseStore;
	}
}
declare module '@nxxt/types/app/vue' {
	export interface AsyncDataOption {
		store: BaseStore
	}

	export interface RegisterModuleOption {
		reqConfig: ReqConfig;
	}
}
