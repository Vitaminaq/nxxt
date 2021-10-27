import type { Router, RouteLocation } from 'vue-router';

export interface AsyncDataOption {
	route: RouteLocation;
	router: Router;
	isServer: boolean;
}

export interface RegisterModuleOption extends AsyncDataOption {}

declare module '@vue/runtime-core' {
	export interface ComponentCustomOptions {
		asyncData?: (option: AsyncDataOption) => Promise<object | void> | object | void;
		registerModule?: (option: RegisterModuleOption) => void;
	}
	export interface ComponentCustomProperties {
		asyncData?: (option: AsyncDataOption) => Promise<object | void> | object | void;
		registerModule?: (option: RegisterModuleOption) => void;
	}
}
