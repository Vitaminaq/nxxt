<template>
	<div id="root" @click="show">
		我是nxxt
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Home'
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
