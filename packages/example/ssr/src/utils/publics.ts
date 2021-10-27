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

/**
 * 跳转小程序需刷新h5页面，则需带上页面的url
 */
export const refreshPageFromMini = <P extends { [K: string]: any }>(
	params?: P
) => {
	let url = '';
	if (params && params.url) {
		url = params.url;
		delete params.url;
	}
	const str = objectToStr(params);
	return `${str ? `${str}&` : '?'}url=${encodeURIComponent(
		url || window.location.href
	)}`;
};
