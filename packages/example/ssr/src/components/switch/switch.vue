<template>
	<div>
		<span
			class="switch"
			:class="{ 'switch-on': checked }"
			:value="value"
			@click="toggle"
		></span>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			checked: this.value,
		};
	},
	watch: {
		checked(val) {
			this.$emit('checked', val);
		},
		value(newVal) {
			if (newVal) {
				this.checked = true;
			}
		},
	},
	methods: {
		toggle() {
			this.checked = !this.checked;
		},
	},
};
</script>

<style>
.switch {
	display: block;
	position: relative;
	width: 51px;
	height: 31px;
	border: 2px solid #e5e5e5;
	outline: 0;
	border-radius: 15px;
	box-sizing: border-box;
	background-color: #ffffff;
	transition: background-color 0.1s, border 0.1s;
	cursor: pointer;
}
.switch:before {
	content: ' ';
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100%-4px);
	height: calc(100%-4px);
	border-radius: 15px;
	background-color: #ffffff;
	transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.switch:after {
	content: ' ';
	position: absolute;
	top: 0;
	left: 0;
	width: 27px;
	height: 27px;
	border-radius: 15px;
	background-color: #ffffff;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
	transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.switch-on {
	border-color: #00b685;
	background-color: #00b685;
}
.switch-on:before {
	border-color: #00b685;
	background-color: #00b685;
}
.switch-on:after {
	transform: translateX(20px);
}
</style>
