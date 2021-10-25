import { Main } from './main';
import { ReqConfig } from '@/services/publics';

export function render(
	reqConfig: ReqConfig
) {
	return new Main(reqConfig);
}
