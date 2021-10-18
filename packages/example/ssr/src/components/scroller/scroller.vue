<template>
	<div class="my_scroll">
		<slot />
		<see-loading :pullUpStatus="pullUpStatus" @pullUp="pullUp">
			<template v-if="$slots.empty" v-slot:empty>
				<slot name="empty" />
			</template>
		</see-loading>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import SeeLoading from './see-loading.vue';

/**
 * 加载的几种状态
 * 未加载   unrequest
 * 正在加载 requesting
 * 加载成功 success
 * 请求失败 failure
 * 加载失败 error
 * 全部加载 done
 */
export default defineComponent({
	components: {
		SeeLoading,
	},
	props: {
		pullUpStatus: {
			type: String,
			default: 'unrequest',
		},
		pullDownStatus: {
			type: String,
			default: 'unrequest',
		},
	},
	methods: {
		pullUp(): void {
			this.$emit('pullUp');
		},
	},
});
</script>
<style lang="less" scoped>
.my_scroll {
	max-height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	position: relative;
}
</style>
