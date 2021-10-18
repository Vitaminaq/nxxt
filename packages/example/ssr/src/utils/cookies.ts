import cookie from 'js-cookie';

export interface cookieKeys {
	token: string;
	platform: 'ios' | 'android' | 'mini';
	channel: string;
	vid: string;
	app_id: string;
}

type Keys = keyof cookieKeys;

export const setCookie = <V>(key: Keys, value: V) => {
	cookie.set(key, value);
};

export const setCookies = (cookies: Record<string, any>) => {
	if (!cookies) return;
	Object.keys(cookies).forEach((key: any) => {
		setCookie(key, cookies[key] || '');
	});
};

export const exitSetCookies = (cookies: Record<string, any>) => {
	if (!cookies) return;
	Object.keys(cookies).forEach((key: any) => {
		if (!cookies[key]) return;
		setCookie(key, cookies[key] || '');
	});
};

export const getCookie = <K extends Keys>(key: K): cookieKeys[K] => {
	if (typeof window === 'undefined') return '' as cookieKeys[K];
	return cookie.get(key);
};

export const removeCookie = (key: Keys) => {
	cookie.remove(key);
};
