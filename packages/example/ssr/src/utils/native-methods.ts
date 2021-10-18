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
		downloadUrl: 'https://h5-hybrid.kuaibaobao.com',
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
 * 切换到票夹tab页
 * @returns
 */
export const toInvoiceTab = () => {
	if (!isNative()) {
		return window.wx.miniProgram.switchTab({
			url: `/pages/invoice/invoice`,
		});
	}
	return native('10002');
};

/**
 * 切换到票夹订单页
 * @returns
 */
export const toSelectOrder = (params: any) => {
	if (!isNative()) {
		return window.wx.miniProgram.redirectTo({
			url: `/packages/order/selectOrder/selectOrder?module=${params.module}&backToInvoive=4`,
		});
	}
	return native('10003');
};

/**
 * 切换到票夹订单页
 * @returns
 */
export const toOrderList = (params: any) => {
	if (!isNative()) {
		let tab = 0;
		switch (params.module) {
			case 'train':
				tab = 0;
				break;
			case 'takeout':
				tab = 1;
				break;
			case 'hotel':
				tab = 2;
				break;
			case 'petrol':
				tab = 3;
				break;
			case 'airline':
				tab = 4;
				break;
			case 'taxi':
				tab = 5;
				break;
			default:
				tab = 0;
				break;
		}
		return window.wx.miniProgram.redirectTo({
			url: `/packages/order/orderList/orderList?tab=${tab}&backToInvoive=4`,
		});
	}
	return native('10004');
};

/**
 * 主动向原生获取状态
 * @returns
 */
export const getSyncAppState = () => {
	return native('10005');
};

/**
 * 跳至福利订单详情页
 */
export const toWelfareDetail = (
	params: NativeMethodTypes['10006']['params']
) => {
	if (!isNative())
		return window.wx.miniProgram.navigateTo({
			url: `/packages/welfareCenter/pages/orderDetail/index${objectToStr(
				params
			)}&url=${encodeURIComponent(window.location.href)}`,
		});
	return native('10006');
};

/**
 * 跳至收银台页面
 */
export const toCheckStand = (params: NativeMethodTypes['10007']['params']) => {
	if (!isNative())
		return window.wx.miniProgram.navigateTo({
			url: `/packages/payment/checkstand/checkstand${objectToStr(
				params
			)}`,
		});
	return native('10007');
};

/**
 * 跳至职场福利
 */
export const toWelfare = () => {
	if (!isNative())
		return window.wx.miniProgram.switchTab({
			url: '/pages/benefit/benefit',
		});
	return native('10008');
};

/**
 * 主动设置原生导航栏标题
 */
export const setNativeTitle = (
	params: NativeMethodTypes['10009']['params']
) => {
	return native('10009', params);
};

/**
 * 去历史兑换页
 */
export const toHistoryExchange = () => {
	if (!isNative())
		return window.wx.miniProgram.navigateTo({
			url: '/packages/exchange/history/history',
		});
	return native('10010');
};
