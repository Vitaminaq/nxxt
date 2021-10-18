import { StoreOberser } from '@wefly/vue-store-next';

/**
 * 监听基类
 */
export class BaseObserve extends StoreOberser {}

/**
 * 基本类
 */
export class BaseClass<A> extends BaseObserve {
	public api: A;
	public constructor(api: A) {
		super();
		this.api = api;
	}
}

/**
 * 请求基类
 */
export abstract class BaseLoaderClass<P, D, A> extends BaseClass<A> {
	public params: P = {} as P;
	public res: API.APIBaseResponse<D> = {} as API.APIBaseResponse<D>;

	public get data(): D | null {
		const { data } = this.res;
		return data ? data : null;
	}
	public set data(val: D | null) {
		this.res.data = val as D;
	}

	public $assignParams(params: Partial<P>): this {
		Object.assign(this.params, params);
		return this;
	}

	// 抽象方法，子类自行实现
	public abstract baseAjaxMethod(params?: P): Promise<API.APIBaseResponse<D>>;
}

/**
 * 基本数据请求基类
 */
export abstract class BaseLoaderData<P, D, A> extends BaseLoaderClass<P, D, A> {
	public requestStatus: API.APIBaseStatus = 'unrequest';

	$requestStart(): this {
		this.requestStatus = 'requesting';
		return this;
	}
	$requestSuccess(res: API.APIBaseResponse<D>): this {
		if (res.code === 0 && res.data) {
			this.requestStatus = 'success';
			this.res = { ...res };
			return this;
		} else {
			if (res.code !== 0 && res.data) {
				this.res = { ...res };
			}
			this.requestStatus = 'error';
		}
		return this;
	}

	/**
	 * 请求数据方法
	 */
	public async loadData(params?: P): Promise<this> {
		this.$requestStart();
		return this.$requestSuccess(await this.baseAjaxMethod(params));
	}
}

const checkList = <L>(d: API.APIBaseListData<L>) => {
	if (d.data === null) {
		d.data = [];
		return;
	}
	if (!Array.isArray(d.data))
		throw Error('后端数据结构错误，请按照标准分页数据结构返回');
};
/**
 * 列表数据请求基类
 */
export abstract class BaseLoaderList<
	P extends API.APIBaseListParams,
	L,
	A
> extends BaseLoaderClass<P, API.APIBaseListData<L>, A> {
	public res: API.APIBaseListResponse<L> = {} as API.APIBaseListResponse<L>;
	public params: P = {
		page: 1,
		page_size: 15,
	} as P;
	public list: L[] = [];
	public dropDownStatus: API.APIBaseListStatus = 'unrequest';
	public pullUpStatus: API.APIBaseListStatus = 'unrequest';
	/**
	 * 下拉逻辑
	 */
	public $dropDownStart(): this {
		this.params.page = 1;
		this.dropDownStatus = 'unrequest';
		this.pullUpStatus = 'unrequest';
		return this;
	}
	public $dropDownSuccess(res: API.APIBaseListResponse<L>) {
		const { code, data } = res;
		if (!res || code !== 0 || !data) {
			this.pullUpStatus = 'error';

			return this;
		}
		checkList(data);
		const { current_page, last_page, data: list } = data;
		if (!list.length) {
			this.pullUpStatus = 'empty';
		} else if (current_page < last_page) {
			this.pullUpStatus = 'success';
			this.params.page++;
		} else {
			this.pullUpStatus = 'done';
		}
		this.list = [...list];
		return this;
	}
	public async dropDown(): Promise<this> {
		this.$dropDownStart();
		const res = await this.baseAjaxMethod();
		this.$dropDownSuccess(res);
		return this;
	}
	/**
	 * 上拉逻辑
	 */
	public $pullUpStart(): this {
		this.pullUpStatus = 'requesting';
		return this;
	}
	public $pullUpSuccess(res: API.APIBaseListResponse<L>): this {
		const { code, data } = res;
		if (!res || code !== 0 || !data) {
			this.pullUpStatus = 'error';

			return this;
		}
		checkList(data);
		const { current_page, last_page, data: list } = data;
		if (current_page === 1 && !list.length) {
			this.pullUpStatus = 'empty';
		} else if (current_page < last_page) {
			this.pullUpStatus = 'success';
		} else {
			this.pullUpStatus = 'done';
		}
		this.params.page++;
		this.list.push(...list);
		this.list = [...this.list];
		return this;
	}
	public async pullUp(): Promise<this> {
		if (['empty', 'done', 'requesting'].includes(this.pullUpStatus))
			return this;
		this.$pullUpStart();
		const res = await this.baseAjaxMethod();
		this.$pullUpSuccess(res);
		return this;
	}
	/**
	 * 清空数据
	 */
	public $clearData(): this {
		this.list = [];
		this.params.page = 1;
		this.res = {} as API.APIBaseListResponse<L>;
		this.dropDownStatus = 'unrequest';
		this.pullUpStatus = 'unrequest';
		return this;
	}
}
