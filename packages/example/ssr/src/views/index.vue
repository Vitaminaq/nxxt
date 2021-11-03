<template>
	<div id="root">
		我是nxxt
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Home',
	asyncData({}) {}
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
	font-size: 24px;
}
</style>
