import { RouteRecordRaw } from 'vue-router';

/**
 * 兼容老项目一些逻辑
 */

/**
 * 老的路由逻辑
 */
export const oldRoutes: Array<RouteRecordRaw> = [
	/**
	 * 318打开小程序
	 */
	{
		path: '/vipPromotionJump.html',
		redirect: {
			name: 'actives-318-jump',
		},
	},
	{
		path: '/pages/vipPromotionJump.html',
		redirect: {
			name: 'actives-318-jump',
		},
	},
	/**
	 * 新年领红包打开小程序
	 */
	{
		path: '/pages/jump-mp.html',
		redirect: {
			name: 'actives-newyear-jump',
		},
	},
	{
		path: '/jump-mp.html',
		redirect: {
			name: 'actives-newyear-jump',
		},
	},
	{
		path: '/pages/activity-help-me.html',
		redirect: {
			name: 'actives-rob-ticker-strategy',
		},
	},
	{
		path: '/pages/agreement-train-ticker.html',
		redirect: {
			name: 'helps-train-ticket',
		},
	},
	{
		path: '/pages/agreement-train-auth.html',
		redirect: {
			name: 'helps-train-auth',
		},
	},
	{
		path: '/pages/ticketNotice.html',
		redirect: {
			name: 'helps-ticket-notice',
		},
	},
];
