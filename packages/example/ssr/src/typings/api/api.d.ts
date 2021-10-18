declare namespace API {
	export interface APIBaseResponse<D> {
		code: number;
		data: D;
		elapsed: number;
		message: string;
		req_sn: string;
	}

	export type APIBaseStatus =
		| 'unrequest'
		| 'requesting'
		| 'success'
		| 'error';

	export type APIBaseListStatus =
		| 'unrequest'
		| 'requesting'
		| 'success'
		| 'error'
		| 'done'
		| 'empty';

	export type APIBaseListParams = {
		page: number;
		page_size?: number;
	};

	export interface APIBaseListData<L> {
		current_page: number;
		data: L[];
		first_page_url: string;
		from: number;
		last_page: number;
		last_page_url: string;
		next_page_url: string;
		path: string;
		per_page: number;
		prev_page_url: null;
		to: number;
		total: number;
	}
	export type APIBaseListResponse<L> = APIBaseResponse<APIBaseListData<L>>;
}
