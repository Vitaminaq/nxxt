declare namespace API.H5.Csrf {
	export interface Data {
		csrf: string;
	}

	export type Response = API.APIBaseResponse<Data>;
}
