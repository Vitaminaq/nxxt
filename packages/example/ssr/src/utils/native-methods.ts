import {
	createNativeBridge,
	isNativeFuncExist,
	NativeMethodTypes,
} from './native';
import { objectToStr } from './publics';

export { isNativeFuncExist };

// 区分原生还是小程序环境
export const isNative = () => {
	if (typeof window === 'undefined') return true;
	const ua = navigator.userAgent.toLowerCase();
	return !/miniProgram/i.test(ua);
};

export const native = <K extends keyof NativeMethodTypes, P>(
	code: K,
	params?: P
): Promise<NativeMethodTypes[K]['response']> => {
	if (!isNativeFuncExist())
		return {
			code: -1,
			data: null,
		} as any;
	return createNativeBridge({
		downloadUrl: 'https://baidu.com',
		onCallSuccess: (options: any) => {
			console.log(options);
		},
		onCallError: (options: any) => {
			console.log(options);
		},
	})(code, params);
};

export interface ToLoginParams {
	url?: string;
}
/**
 * 去登陆
 */
export const toLogin = async (params?: ToLoginParams) => {
	if (!isNative()) {
		return window.wx.miniProgram.navigateTo({
			url: `/packages/login/login/login${objectToStr(params)}`,
		});
	}
	return native('10000', params);
};

/**
 * 关闭webview
 */
export const webviewBack = (params: any) => {
	return native('10001', params);
};


/**
 * 主动向原生获取状态
 * @returns
 */
export const getSyncAppState = () => {
	return native('10005');
};

/**
 * 主动设置原生导航栏标题
 */
export const setNativeTitle = (
	params: NativeMethodTypes['10009']['params']
) => {
	return native('10009', params);
};
