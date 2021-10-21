import { Main } from './main';
import { getAsyncData, ReqConfig } from '@/services/publics';

export async function render(
	url: string,
	reqConfig: ReqConfig
) {
	const main = new Main(reqConfig);

	const { router, store } = main;

	// 同步url
	router.push(url);

	// 根据参数决定是否需要预取数据
	await router.isReady();
	const { pd } = router.currentRoute.value.query;
	// 根据参数决定是否需要预取数据
	Number(pd) && store.$setSsrPath(url);
	await getAsyncData(router, store, true, reqConfig);

	return main;
}
