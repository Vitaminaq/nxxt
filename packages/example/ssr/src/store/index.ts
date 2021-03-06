import { ReqConfig } from '@/services/publics';
import Store, { NotifyOptions } from '@wefly/vue-store-next';

export class BaseStore extends Store {
	public subList: NotifyOptions[] = [];
	// 储存ssr路径
	public ssrPath = '';

	public constructor(reqConfig?: ReqConfig) {
		super();
		return this.init();
	}

	public $setSsrPath(path: string) {
		this.ssrPath = path;
	}
}

export default BaseStore;
