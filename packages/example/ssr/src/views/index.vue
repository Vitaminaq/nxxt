<template>
	<div id="root" @click="show">
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { toLogin } from '@/utils/native-methods';

export default defineComponent({
	name: 'Home',
	mounted() {
		this.show();
	},
	methods: {
		show() {
			return toLogin();
		},
	},
});
</script>
<style lang="less">
html {
	// prettier-ignore
	min-width: 980PX;
}

#root {
	width: 100%;
	height: auto;
}

#root img {
	float: left;
	width: 100%;
	height: auto;
}
</style>
