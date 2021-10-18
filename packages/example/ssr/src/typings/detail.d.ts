declare namespace API.Detail {
	export namespace ArticDetail {
		export interface RequestParams {
			id: string | number;
		}
		export interface Click {
			name: Array<string>;
			num: number;
		}
		export interface Commentxt {
			clicknum: number;
			commentId: number;
			creatAt: string;
			headimg: string;
			isClickComment: boolean;
			msg: string;
			nickname: string;
		}
		export interface Data {
			articId: number;
			clicknum: number;
			headimg: string;
			commentList: Array<Commentxt>;
			commentnum: number;
			creatAt: string;
			msg: string;
			nickname: string;
			title: string;
			updateAt: string | undefined;
			viewnum: number;
			isClick: boolean;
		}
		export type Response = API.APIBaseResponse<Data>;
	}
}
