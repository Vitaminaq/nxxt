<template>
	<div class="my-pupop" @touchmove.prevent>
		<!--遮罩层-->
		<div
			:class="
				type === 'alert'
					? 'my-pupop-bg'
					: mask === true
					? 'my-pupop-mask'
					: ''
			"
			:style="{ opacity: show ? bgOpacity : 0 }"
			@click="bgClose"
		></div>
		<!--toast-->
		<transition name="min-toast" appear>
			<div
				v-if="isToast && show"
				class="min-toast"
				:class="{
					'min-toast_icon': icon,
				}"
			>
				<img :src="relIcon" class="icon" v-if="icon" />
				<p class="title">{{ title }}</p>
			</div>
		</transition>
		<!--loading -->
		<transition name="min-toast" appear>
			<div class="min-toast min-toast_icon" v-if="isLoading && show">
				<img :src="relIcon" class="icon" />
				<p class="title">{{ title }}</p>
			</div>
		</transition>
		<!--alert-->
		<transition name="popup" appear>
			<div v-if="type === 'alert' && show" class="my-pupop-content">
				<div>
					<div class="my-pupop-title" v-if="title">{{ title }}</div>
					<img :src="relIcon" class="icon" v-if="icon" />
					<div class="my-pupop-message" v-if="content">
						{{ content }}
					</div>
				</div>
				<div
					class="my-pupop-operate"
					:class="{ 'my-pupop-operates': showCancel }"
				>
					<!--取消按钮-->
					<button
						class="my-pupop-btn"
						:style="{ color: cancelColor }"
						@click="handleClickBtn($event)"
						v-if="showCancel"
						confirm="0"
					>
						{{ cancelText }}
					</button>
					<!--确认按钮-->
					<button
						class="my-pupop-btn"
						:style="{ color: confirmColor }"
						@click="handleClickBtn($event)"
						confirm="1"
					>
						{{ confirmText }}
					</button>
				</div>
			</div>
		</transition>
		<!--iframe-->
		<transition name="popup" appear>
			<div class="iframe-popup" v-if="type === 'iframe' && show">
				<iframe class="iframe-contain" :src="url" />
			</div>
		</transition>
	</div>
</template>
<script lang="ts">
import { PropType } from 'vue';
import successIcon from './images/success.svg';
import warnIcon from './images/warn.svg';
import errorIcon from './images/error.svg';
import loadingIcon from './images/loading.gif';

export interface VuePupupButton {
	text: string;
	color?: string;
	callback?: () => any;
}
export type PopupType = 'confirm' | 'alert' | 'loading' | 'toast';

export type PopupCallback = (e: any) => Promise<any>;

export type PopupIcon = 'success' | 'warn' | 'error';

export type PopupButton = {
	text: string;
	color?: string;
};

export interface PopupOption {
	title?: string;
	content: string;
	showCancel?: boolean;
	cancelText?: string;
	cancelColor?: string;
	confirmText: string;
	confirmColor: string;
	mask: boolean; // 防止穿透
	image?: string; // 等级高于Icon
	type: PopupType;
	callback?: PopupCallback;
	duration?: number;
	icon?: PopupIcon;
	bgOpacity?: number;
	url?: string;
}

interface Data {
	timer: any;
	show: boolean;
}

export default {
	props: {
		title: {
			type: String,
			default: '提示',
		},
		content: {
			type: String,
			default: '',
		},
		showCancel: {
			type: Boolean,
			default: true,
		},
		cancelText: {
			type: String,
			default: '取消',
		},
		cancelColor: {
			type: String,
			default: '#666666',
		},
		confirmText: {
			type: String,
			default: '确定',
		},
		confirmColor: {
			type: String,
			default: '#00B685',
		},
		mask: {
			type: Boolean,
			default: true,
		},
		image: {
			type: String,
			default: '',
		},
		type: {
			type: String as PropType<PopupType>,
			default: 'toast',
		},
		callback: {
			type: Function as PropType<PopupCallback>,
			default: null,
		},
		duration: {
			type: Number,
			default: 2000,
		},
		icon: {
			type: String as PropType<PopupIcon>,
			default: '',
		},
		bgOpacity: {
			type: Number,
			default: 0.7,
		},
		url: {
			type: String,
			default: '',
		},
	},
	data(): Data {
		return {
			timer: 0,
			show: false,
		};
	},
	computed: {
		isLoading(): boolean {
			return this.type === 'loading';
		},
		isToast(): boolean {
			return this.type === 'toast';
		},
		relIcon(): string {
			if (this.image && this.isToast) {
				return this.image;
			} else {
				const icons = {
					success: successIcon,
					warn: warnIcon,
					error: errorIcon,
				};
				const { icon } = this;
				if (!icon) return loadingIcon;
				return icons[icon] || icon;
			}
		},
	},
	async mounted() {
		this.show = true;
		if (this.isToast || this.isLoading) {
			if (this.callback) {
				const r = await this.callback(null);
				this.$emit('close', r);
				return;
			} else {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.show = false;
					setTimeout(() => {
						this.$emit('close', null);
					}, 300);
				}, this.duration);
			}
		}
	},
	methods: {
		async handleClickBtn(e: any) {
			const res = {
				confirm:
					Number(e.target.getAttribute('confirm')) === 1
						? true
						: false,
			};
			if (this.callback) {
				await this.callback(res);
			}
			return this.emitParent(res);
		},
		bgClose() {
			if (this.isLoading || this.isToast) return;
			this.emitParent(null);
		},
		emitParent(r: any) {
			this.show = false;
			setTimeout(() => {
				this.$emit('close', r);
			}, 300);
		},
	},
};
</script>
<style lang="less">
.my-pupop {
	.my-pupop-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9998;
		background-color: #000000;
		opacity: 0;
		transition: all 0.3s;
	}
	.my-pupop-mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9998;
		opacity: 1;
		transition: all 0.3s;
	}
	@keyframes showToast {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}

		to {
			opacity: 0.8;
			transform: translate(-50%, -50%) scale(1);
		}
	}
	@keyframes hideToast {
		from {
			opacity: 0.8;
			transform: translate(-50%, -50%) scale(1);
		}

		to {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
	}
	.min-toast {
		position: fixed;
		top: 50%;
		left: 50%;
		font-size: 14px;
		transform: translate(-50%, -50%) scale(1);
		background-color: #4c4c4c;
		opacity: 0.8;
		color: #fff;
		padding: 10px 12px;
		border-radius: 6px;
		z-index: 9999;
		text-align: center;
		line-height: 15px;
		.icon {
			height: 40px;
			width: 40px;
			display: block;
			margin: 0 auto 15px auto;
		}
		&_icon {
			width: 120px;
			height: 120px;
			padding: 25px 10px;
			box-sizing: border-box;

			.title {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}
	}
	.min-toast-enter-active {
		animation: showToast 0.3s;
	}
	.min-toast-leave-active {
		animation: hideToast 0.3s;
	}

	@keyframes showPopup {
		from {
			opacity: 0;
			transform: translateY(-50%) scale(0);
		}

		to {
			opacity: 1;
			transform: translateY(-50%) scale(1);
		}
	}
	@keyframes hidePopup {
		from {
			opacity: 1;
			transform: translateY(-50%) scale(1);
		}

		to {
			opacity: 0;
			transform: translateY(-50%) scale(0);
		}
	}
	.my-pupop-content {
		position: fixed;
		top: 50%;
		left: 15%;
		right: 15%;
		z-index: 9999;
		padding-top: 20px;
		transform: translateY(-50%);
		background-color: #fff;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		text-align: center;
		img,
		svg {
			height: 40px;
			width: 40px;
			display: block;
			margin: 0 auto 20px auto;
		}
		.my-pupop-title {
			font-size: 18px;
			font-weight: 600;
			color: #333333;
			line-height: 18px;
			text-align: center;
			padding-bottom: 18px;
		}
		.my-pupop-message {
			margin-bottom: 20px;
			text-align: center;
			font-size: 15px;
			font-weight: 400;
			color: #505050;
			padding: 0 20px;
			line-height: 20px;
		}
		.my-pupop-operates {
			.my-pupop-btn {
				&:nth-child(1) {
					// prettier-ignore
					border-right: 1px solid rgba(0, 0, 0, 0.1);
				}
			}
		}
		.my-pupop-operate {
			display: flex;
			align-items: center;
			// prettier-ignore
			border-top: 1px solid rgba(0, 0, 0, 0.1);
			.my-pupop-btn {
				margin: 0;
				outline: none;
				border: none;
				background-color: rgba(255, 255, 255, 0);
				font-size: 18px;
				font-weight: 400;
				flex: 1;
				cursor: pointer;
				height: 50px;
			}
		}
	}
	.iframe-popup {
		height: 70vh;
		position: fixed;
		top: 50%;
		left: 15%;
		right: 15%;
		transform: translateY(-50%);
		background-color: #fff;
		z-index: 9999;

		.iframe-contain {
			border: none;
			width: 100%;
			height: 100%;
			overflow: auto;
		}
	}
	.popup-enter-active {
		animation: showPopup 0.3s;
	}
	.popup-leave-active {
		animation: hidePopup 0.3s;
	}
}
</style>
