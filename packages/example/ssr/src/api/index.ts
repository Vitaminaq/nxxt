import BaseAxios from '@/utils/local-axios';
import { config, Config } from '@/utils/config';

// 获取对应baseUrl
const getBaseUrl = (key: keyof Config = 'base_url'): string => {
	return config[key] ? config[key] : key;
};

// 替换url中的占位符
export const replacePlaceholder = <P extends { [key: string]: any }>(
	url: string,
	params?: P
) => {
	if (!params) return { url };
	const p = { ...params };
	Object.keys(params).forEach((i) => {
		const key = `{${i}}`;
		if (url.match(key)) {
			url = url.replace(key, params[i]);
			delete p[i];
		}
	});
	return {
		url,
		params: p,
	};
};

// 获取csrfToken
export const getCsrfToken = async (axios: BaseMethod) => {
	const csrfToken = sessionStorage.getItem('csrf_token');
	if (csrfToken) return csrfToken;
	const r: API.H5.Csrf.Response = await axios.axios.get('/h5/token/csrf', {
		baseURL: getBaseUrl('base_url'),
	});
	if (r.code !== 0) return '';
	const { csrf } = r.data;
	sessionStorage.setItem('csrf_token', csrf);
	return r.data.csrf;
};

export class BaseMethod extends BaseAxios {
	public baseUrlKey: keyof Config = 'base_url';

	public async get<P extends { [key: string]: any }, R>(
		url: string,
		params?: P,
		baseUrlKey?: keyof Config
	): Promise<R> {
		const key: keyof Config = baseUrlKey || this.baseUrlKey;
		const up = replacePlaceholder<P>(url, params);
		// const _token = await getCsrfToken(this);
		return this.axios.get(up.url, {
			baseURL: getBaseUrl(key),
			params: {
				...up.params,
				// _token
			},
		});
	}
	public async post<P, R>(
		url: string,
		params?: P,
		baseUrlKey?: keyof Config
	): Promise<R> {
		const key: keyof Config = baseUrlKey || this.baseUrlKey;
		const up = replacePlaceholder<P>(url, params);
		// const _token = await getCsrfToken(this);
		return this.axios.post(
			up.url,
			{
				...up.params, // _token
			},
			{
				baseURL: getBaseUrl(key),
			}
		);
	}
	public async put<P, R>(
		url: string,
		params?: P,
		baseUrlKey?: keyof Config
	): Promise<R> {
		const key: keyof Config = baseUrlKey || this.baseUrlKey;
		const up = replacePlaceholder<P>(url, params);
		// const _token = await getCsrfToken(this);
		return this.axios.put(
			up.url,
			{
				...up.params, // _token
			},
			{
				baseURL: getBaseUrl(key),
			}
		);
	}
	public delete<P, R>(
		url: string,
		params?: P,
		baseUrlKey?: keyof Config
	): Promise<R> {
		const key: keyof Config = baseUrlKey || this.baseUrlKey;
		const up = replacePlaceholder<P>(url);
		return this.axios.delete(up.url, {
			baseURL: getBaseUrl(key),
		});
	}
}

export default BaseMethod;
