<template>
    <svg class="svg-icon" :style="{height: size, width: size}" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
	export default {
		name: 'svg-icon',
		props: {
			size:{
                type:String,
                default:'1em'
            },
			iconClass: {
				type: String,
				required: true
			}
		},
		computed: {
			iconName() {
				return `#icon-${this.iconClass}`
			}
		}
	}
</script>

<style>
    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
