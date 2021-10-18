// 获取url后面参数
export const getQueryParams = (
	param: string | (string | null)[] | null
): string => {
	const p = Array.isArray(param) ? param[0] : param;
	return p || '';
};

// 是否需要登录
export const hasLogin = (cb: () => void, autoLogin = true) => {
	return autoLogin;
	// const { token } = getUrlQuery();
	// if (!token || token === '0') return autoLogin ? App.login() : '';
	// typeof cb === 'function' && cb();
};

/**
 * 检测元素是否在可视区
 */
export function inView(el: HTMLElement): number {
	const bcr = el.getBoundingClientRect(); // 取得元素在可视区的位置

	const mw = el.offsetWidth; // 元素自身宽度
	const w = window.innerWidth; // 视窗的宽度
	let distance = 0; // 需要移动到可视区的距离
	if (bcr.right - mw <= 0 && bcr.left <= 0) {
		distance = -mw;
	}
	if (bcr.left + mw >= w && bcr.right + mw >= mw + w) {
		distance = mw;
	}
	return distance;
}

/**
 * object to string
 */
export const objectToStr = <P extends { [K: string]: any }>(params?: P) => {
	if (!params) return '';
	const keys = Object.keys(params);
	if (!keys.length) return '';
	let str = '?';
	keys.forEach((k) => {
		str = str + `${k}=${params[k]}&`;
	});
	return str.substr(0, str.length - 1);
};
