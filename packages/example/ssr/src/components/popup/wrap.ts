import { createApp } from 'vue';
import Popup from './popup.vue';

// 此写法暂时有bug
// const vn: VNode = createVNode(Popup, {
// 	...propsData,
// 	onClose: function (r: any) {
// 		resolve(r);
// 		const el = vn.el as Node;
// 		if (!document.body.contains(el)) return;
// 		document.body.removeChild(el);
// 	},
// });
// render(vn, document.body);

// console.log(vn, 'ooooooooooooooooooooooooooooooo');

// document.body.appendChild((vn as any).el);

const targetId = 'wefly-vue-popup';

export interface ConfirmOptions {
	content?: string;
	bgOpacity?: number;
	buttons?: CreateMyPupupButton[];
	callback?: () => any;
}

export interface AlertOptions {
	icon?: 'success' | 'warn' | 'error';
	content?: string;
	bgOpacity?: number;
	confirmText?: string;
	confirmColor?: string;
	title?: string;
	showCancel?: boolean;
	cancelText?: string;
	cancelColor?: string;
	callback?: (e: { confirm: boolean }) => any;
}

export interface LoadingOptions<R> {
	title?: string;
	mask?: boolean;
	duration?: number;
	callback?: (res: R) => void;
}

export interface ToastOptions {
	icon?: 'success' | 'warn' | 'error';
	mask?: boolean;
	title?: string;
	duration?: number;
	image?: string;
}

export interface IframeOptions {
	url: string;
}

export interface CreateMyPupupButton {
	text: string;
	color?: string;
	callback?: () => any;
}

const create = (propsData: any, resolve?: any) => {
	if (typeof window === 'undefined') return;
	const isExit = document.getElementById(targetId);
	if (isExit) {
		document.body.removeChild(isExit);
	}
	const vn = createApp(Popup, {
		...propsData,
		onClose: function (r: any) {
			resolve && resolve(r);
			vn.unmount();
			const oldDom = document.getElementById(targetId);
			oldDom && document.body.removeChild(oldDom);
		},
	});
	const dom = document.createElement('div');
	dom.id = targetId;
	document.body.appendChild(dom);
	vn.mount(`#${targetId}`);
};

const hasCallback = <R>(propsData: any): Promise<R> => {
	return new Promise((resolve) => {
		create(propsData, resolve);
	});
};

export const confirm = <R>(options: ConfirmOptions = {}): Promise<R> => {
	const { buttons } = options;
	if (!buttons || !buttons.length) {
		options.buttons = [
			{
				text: '确定',
				color: 'orange',
			},
			{
				text: '取消',
			},
		];
	}
	return hasCallback<R>({ ...options, type: 'confirm' });
};

export const alert = (options: AlertOptions = {}): Promise<any> => {
	const { confirmText } = options;
	if (!confirmText) {
		options.confirmText = '确定';
	}
	return hasCallback({ ...options, type: 'alert' });
};

export const loading = <R>(options: LoadingOptions<R>): Promise<R> => {
	return hasCallback({ ...options, type: 'loading' });
};

export interface ToastPropsData extends ToastOptions {
	type: 'toast';
}

export const toast = (
	options: ToastOptions | string,
	duration?: number
): any => {
	const propsData: ToastPropsData = {
		type: 'toast',
	};
	if (typeof options === 'string') {
		propsData.title = options;
		duration && (propsData.duration = duration);
	} else {
		Object.assign(propsData, options);
	}
	create(propsData);
};

export interface IframePropsData extends IframeOptions {
	type: 'iframe';
}

export const iframe = (options: IframeOptions) => {
	return hasCallback({ ...options, type: 'iframe' });
};

export default {
	confirm,
	alert,
	loading,
	toast,
	iframe,
};
