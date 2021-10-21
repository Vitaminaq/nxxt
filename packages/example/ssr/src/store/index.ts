import { ReqConfig } from '@/services/publics';
import Store, { NotifyOptions } from '@wefly/vue-store-next';

export class BaseStore extends Store {
	public subList: NotifyOptions[] = [];
	// 储存ssr路径
	public ssrPath = '';

	public constructor(reqConfig?: ReqConfig) {
		super();
		// 服务端会增加内存
		// this.subscribe((event) => {
		// 	this.subList.push(event);
		// 	console.log('');
		// 	Object.keys(event).forEach((key) => {
		// 		console.log(`${key}：`, event[key as keyof NotifyOptions]);
		// 	});
		// 	console.log('');
		// });
		return this.init();
	}

	public $setSsrPath(path: string) {
		this.ssrPath = path;
	}
}

export default BaseStore;

declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		$store: BaseStore;
	}
}
