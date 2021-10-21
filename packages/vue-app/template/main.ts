import APP from './App';
import { App } from 'vue';
import { createRouter } from './router';
// import Store, { BaseStore } from './store';
import { _createApp } from '@/utils/config';
import { Router } from 'vue-router';
// import { ReqConfig } from './services/publics';

export class Main {
	public app: App = _createApp(APP);
	public router: Router = createRouter();
	// public store: BaseStore;

	constructor() {
		// reqConfig?: ReqConfig
		// this.store = new Store(reqConfig);
		const { app, router } = this; // store
		app.use(router);
	}
}
