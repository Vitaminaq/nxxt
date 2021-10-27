export interface NativeResponse<D> {
	code: number;
	data: D;
}
export interface NativeMethodTypes {
	'10000': {
		params: any;
		response: any;
	};
	'10001': {
		params: any;
		response: any;
	};
	//  pages/invoice/invoice
	'10002': {
		params: any;
		response: any;
	};
	//  packages/order/selectOrder/selectOrder
	'10003': {
		params: any;
		response: any;
	};
	//  packages/order/orderList/orderList
	'10004': {
		params: any;
		response: any;
	};
	'10005': {
		params: any;
		response: NativeResponse<{
			token: string;
			app_id: string | number;
			platform: 'ios' | 'android' | 'mini';
		}>;
	};
	// 主动设置原生导航栏标题
	'10009': {
		params: {
			title: string;
		};
		response: NativeResponse<any>;
	};
	'10010': {
		params: any;
		response: NativeResponse<any>;
	};
}

/**
 * 注意事项, 因为Flutter的跨平台特性, 所以在处理相关的系统判断时, 需要先处理flutter的对应逻辑, 其次才是ios 或者Android
 */

const NATIVE_NAME: keyof Window = '__kbb_native__'; // 原生往 window 对象中注入调用方法
const NATIVE_FLUTTER_NAME: keyof Window = 'KbbFlutterNative'; // 原生往 window 对象中注入调用方法
const NATIVE_CALL_BACK_NAME: keyof Window = '__kbb_native_callback__'; // 原生方法执行完成后，执行的回调方法

/**
 * 所有的通信都是基于此底层方法进行实现
 */
const NATIVE_POST_MESSAGE_NAME = 'syncAppState';

const getWindow = (): any => {
	return window;
};
const isIOS = !!(
	typeof window === 'object' &&
	getWindow().webkit &&
	getWindow().webkit.messageHandlers
);
const isIOSBridge = !!(
	isIOS && getWindow().webkit.messageHandlers.iOS_Native_InjectJavascript
);
const isAndroid = !!(
	typeof window === 'object' && typeof window[NATIVE_NAME] === 'object'
);

const getFlutterWebview = (): any => {
	if (typeof window !== 'object') return null;
	const win = getWindow();
	let webview = null;
	// Android
	if (typeof win[NATIVE_FLUTTER_NAME] === 'object') {
		webview = win[NATIVE_FLUTTER_NAME];
	} else if (
		isIOS &&
		typeof win.webkit.messageHandlers[NATIVE_FLUTTER_NAME] === 'object'
	) {
		webview = win.webkit.messageHandlers[NATIVE_FLUTTER_NAME];
	}

	return webview;
};

const isFlutter = !!getFlutterWebview();

//-------------end------------------

/**
 * 判断原生的方法是否存在
 */
export const isNativeFuncExist = (
	fnName = NATIVE_POST_MESSAGE_NAME
): boolean => {
	if (isFlutter) {
		return true;
	} else if (isIOS) {
		return !!getWindow().webkit.messageHandlers[fnName];
	} else if (isAndroid) {
		return !!window[NATIVE_NAME][fnName];
	}
	return false;
};

// APP 4.0 新增 具体文档请查看: https://github.com/Lision/WKWebViewJavascriptBridge
function iosSetupWKWebViewJavascriptBridge(callback: any): void {
	const win = getWindow();
	if (win.WKWebViewJavascriptBridge) {
		return callback(win.WKWebViewJavascriptBridge);
	}
	if (win.WKWVJBCallbacks) {
		return win.WKWVJBCallbacks.push(callback);
	}
	win.WKWVJBCallbacks = [callback];
	win.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
}

if (typeof window === 'object' && isIOSBridge) {
	iosSetupWKWebViewJavascriptBridge((bridge: any) => {
		bridge.registerHandler(
			NATIVE_POST_MESSAGE_NAME,
			(data: any, responseCallback: (res: any) => void) => {
				return getWindow()
					.app.syncAppState(data)
					.then(responseCallback);
			}
		);
	});
}
export const getNativeFnList = (): string[] => {
	if (isIOS) {
		return Object.keys(getWindow().webkit.messageHandlers);
	} else if (isAndroid) {
		return Object.keys(window[NATIVE_NAME]);
	}
	return [];
};

export interface CallOptions {
	id: number;
	code: keyof NativeMethodTypes;
	fnName: string;
	response: any;
}

export interface CreateNativeBridgeOptions {
	downloadUrl: string;
	onCallSuccess: (options: CallOptions) => void;
	onCallError: (options: CallOptions) => void;
}
export type CreateNativeBridge<K extends keyof NativeMethodTypes> = (
	code: K,
	params: NativeMethodTypes[K]['params']
) => Promise<NativeMethodTypes[keyof NativeMethodTypes]['response']>;

export const createNativeBridge = (
	options: CreateNativeBridgeOptions
): CreateNativeBridge<keyof NativeMethodTypes> => {
	return <K extends keyof NativeMethodTypes>(
		code: K,
		params: NativeMethodTypes[K]['params']
	): NativeMethodTypes[K]['response'] => {
		const win = getWindow();
		win.__fm_native_count__ = win.__fm_native_count__ || 0;
		win.__fm_native_count__++;
		const id: number = win.__fm_native_count__;

		const resolveName = `resolve_${win.__fm_native_count__}`;
		const rejectName = `reject_${win.__fm_native_count__}`;
		const fnName = NATIVE_POST_MESSAGE_NAME;

		return new Promise(async (resolve, reject) => {
			const sendData: any = {
				params,
				code,
				resolveName,
				rejectName,
			};
			const sendDataString = JSON.stringify(sendData);

			if (!win[NATIVE_CALL_BACK_NAME]) {
				win[NATIVE_CALL_BACK_NAME] = {};
			}
			win[NATIVE_CALL_BACK_NAME][resolveName] = (response: any) => {
				console.log('结果================================>', response);
				options.onCallSuccess({ id, fnName, code, response });
				return resolve(response);
			};
			win[NATIVE_CALL_BACK_NAME][rejectName] = (e: Error) => {
				console.log('错误================================>', e);
				options.onCallError({ id, fnName, code, response: e });
				// eslint-disable-next-line no-console
				console.log(`触发错误回调: ${e}`, id, code, sendData);
				return reject(e);
			};
			try {
				if (isFlutter) {
					return getFlutterWebview().postMessage(sendDataString);
				} else if (isIOS) {
					// ios 第一种通讯的方式
					if (
						typeof win.webkit.messageHandlers[fnName] ===
							'object' &&
						typeof win.webkit.messageHandlers[fnName]
							.postMessage === 'function'
					) {
						return win.webkit.messageHandlers[fnName].postMessage(
							sendDataString
						);
					} else if (isIOSBridge) {
						// ios 第二种通讯的方式
						return iosSetupWKWebViewJavascriptBridge(
							(bridge: any) => {
								return bridge.callHandler(
									fnName,
									sendDataString,
									resolve
								);
							}
						);
					}
				} else if (
					isAndroid &&
					typeof window[NATIVE_NAME][fnName] === 'function'
				) {
					return window[NATIVE_NAME][fnName](sendDataString);
				}
				win.location.href = `${options.downloadUrl}?fnName=${fnName}&code=${code}`;
			} catch (e) {
				console.log(e);
				reject(e);
			}
		})
			.then((res) => {
				delete window[NATIVE_CALL_BACK_NAME][resolveName];
				delete window[NATIVE_CALL_BACK_NAME][rejectName];

				console.log(`调用原生方法：${fnName}`);
				return Promise.resolve(res as any);
			})
			.catch((err) => {
				delete window[NATIVE_CALL_BACK_NAME][resolveName];
				delete window[NATIVE_CALL_BACK_NAME][rejectName];
				console.log(`调用原生方法：${fnName} ${err.toString()}`);
				return Promise.reject(err);
			});
	};
};

declare global {
	interface Window {
		__kbb_native__: any;
		KbbFlutterNative: any;
		__kbb_native_callback__: any;
	}
}
