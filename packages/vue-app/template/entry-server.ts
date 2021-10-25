import { Main } from './main';

export async function render(
	reqConfig: any
) {
	return new Main(reqConfig);
}
