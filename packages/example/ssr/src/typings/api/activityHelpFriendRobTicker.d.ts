declare namespace API.Helper.Info {
	export interface Params {
		id: string;
	}

	export interface Data {
		current_user_num: number;
		help_user: number;
		help_num: number;
		list: List[];
		to_station_name: string;
		all_buy_num: number;
		order_status: number;
		allow_help: boolean;
		ticket_speed: string;
		nick_name: string;
	}

	export interface List {
		name: string;
		avatar_url: string;
		help_num: number;
	}

	export type Response = API.APIBaseResponse<Data>;
}

declare namespace API.Helper.Addspeed {
	export interface Params {
		id: string;
		name: string;
		avatar_url: string;
	}

	export interface Data {
		help_num: number;
	}

	export type Response = API.APIBaseResponse<Data>;
}
