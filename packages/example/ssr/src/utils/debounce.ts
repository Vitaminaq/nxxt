/**
 * 防抖
 */
export class Debounce {
	public timer: any;
	public use(callback: (...arg: any[]) => void, delay: number) {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			callback();
		}, delay);
	}
}
