/**
 * 请求基类
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';
import { getCookie, cookieKeys } from '@/utils/cookies';
import { ReqConfig } from '@/services/publics';
import { toLogin } from '@/utils/native-methods';

/**
 * 处理统一错误code
 */
const handlerErrMsg = function (err: string, code: number) {
	if (typeof window === 'undefined') return;
	if (!err) return;
};

/**
 * 过滤某个请求错误code全局拦截
 */
const noHandleErrCode = (config: AxiosRequestConfig) => {
	const { data, params } = config;
	const option = data || params;
	const { ignore_code } = option;
	if (!ignore_code) return;
	config.ignore_code = ignore_code;
	delete option.ignore_code;
};

/**
 * 获取请求头相关参数
 */
const getHeaderParams = (config?: ReqConfig) => {
	const p: cookieKeys = {
		token: '',
		app_id: '',
		vid: '',
		channel: '',
		platform: 'mini',
	};
	if (config) {
		Object.assign(p, config);
	} else {
		Object.keys(p).forEach((key: string) => {
			const k = key as keyof cookieKeys;
			p[k] = getCookie(k) as any;
		});
	}
	const { token, vid, channel, platform, app_id } = p;

	return {
		Authorization: token ? `Bearer ${token}` : '',
		'X-APP-ID': app_id || 4,
		'X-SESS-ID': vid,
		'X-CHANNEL': channel,
		'X-PLATFORM': platform,
	};
};
class BaseAxios {
	public axios: AxiosInstance;
	public reqConfig?: ReqConfig;

	constructor(reqConfig?: ReqConfig) {
		this.reqConfig = reqConfig;
		this.axios = axios.create({
			baseURL: config.base_url,
			timeout: 16000,
			// withCredentials: true,
			headers: {
				...getHeaderParams(reqConfig),
				'Content-Type': 'application/json',
			},
		});
		this.onRequest();
		this.onResponse();
	}
	private onRequest() {
		this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
			config.headers = {
				...config.headers,
				...getHeaderParams(this.reqConfig),
			};
			noHandleErrCode(config);
			return config;
		});
	}
	private onResponse() {
		this.axios.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data, config } = response;
				const { code, message } = data;
				const { ignore_code } = config;
				if (ignore_code?.match(code)) return data;
				switch (code) {
					// 统一错误弹窗
					case -1:
						handlerErrMsg(message, code);
						break;
					// 未登录
					case -1000:
						handlerErrMsg(message, code);
						break;
					// 正常响应
					default:
						break;
				}
				return data;
			},
			(error) => {
				handlerErrMsg(error, -520);
				return Promise.resolve({
					code: -520,
					data: null,
					error,
				});
			}
		);
	}
}

export default BaseAxios;

declare module 'axios' {
	export interface AxiosRequestConfig {
		ignore_code?: string;
	}
}
