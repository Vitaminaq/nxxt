import APP from './App.vue';
import { App } from 'vue';
import { createRouter } from './router';
import Store, { BaseStore } from './store';
import { _createApp } from './config';
import { Router } from 'vue-router';
// import { ReqConfig } from './services/publics';

type ReqConfig = any;
export class Main {
	public app: App = _createApp(APP);
	public router: Router = createRouter();
	public store: BaseStore;

	constructor(reqConfig?: ReqConfig) {
		this.store = new Store(reqConfig);
		const { app, router, store } = this;
		app.use(router).use(store);
	}
}
