<template>
	<div class="see-loading">
		<div v-if="pullUpStatus === 'done'" class="done">无更多数据</div>
		<div v-else-if="pullUpStatus === 'error'" class="error" @click="reload">
			加载失败，请点击重新加载
		</div>
		<div v-else-if="pullUpStatus === 'empty'">
			<div v-if="!$slots.empty" class="empty">暂无数据</div>
			<slot name="empty" />
		</div>
		<div v-else class="loading">
			<div class="loading-icon"></div>
			加载中
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import inview from './inview';

//  | 'unrequest'
// 	| 'requesting'
// 	| 'success'
// 	| 'error'
// 	| 'done'
// 	| 'empty';

export default defineComponent({
	props: {
		pullUpStatus: {
			type: String,
			default: 'unrequest',
		},
		pullUp: {
			type: Function,
			default: () => {
				return;
			},
		},
	},
	data(): {
		timer: any;
	} {
		return {
			timer: 0,
		};
	},
	async mounted() {
		await this.onSee();
		this.timer = setInterval(this.onSee, 500);
	},
	beforeUnmount() {
		clearInterval(this.timer);
	},
	methods: {
		async reload() {
			await this.$emit('pullUp');
			this.timer = setInterval(this.onSee, 500);
		},
		onSee() {
			const isSee = inview(this.$el, {});
			if (
				isSee &&
				this.pullUpStatus !== 'requesting' &&
				this.pullUpStatus !== 'done' &&
				this.pullUpStatus !== 'error' &&
				this.pullUpStatus !== 'empty'
			) {
				this.$emit('pullUp');
			}
		},
	},
});
</script>

<style lang="less" scoped>
.see-loading {
	width: 100%;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 14px;
	color: #adadad;

	.done,
	.error {
		height: 60px;
		width: 100%;
		line-height: 60px;
	}

	.loading,
	.empty {
		height: 100px;
		line-height: 100px;
		.load-img {
			height: 20px;
			width: 20px;
		}
	}

	@keyframes btn-spin {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading {
		.loading-icon {
			display: inline-block;
			margin-right: 12px;
			vertical-align: middle;
			width: 14px;
			height: 14px;
			background: transparent;
			border-radius: 50%;
			border: 2px solid #e9eaec;
			border-color: #e9eaec #e9eaec #e9eaec #00b685;
			animation: btn-spin 0.6s linear;
			animation-iteration-count: infinite;
		}
	}
}
</style>
