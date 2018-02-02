<template>
	<div class="pregress-circle">
		<svg :width="radius" :height="radius" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" id="svgWrap">
			<circle cx="50" cy="50" r="50" class="circle" stroke="rgba(255, 205, 49, 0.5)" fill="transparent"/>
			<circle cx="50" cy="50" r="50" class="circle" fill="transparent" stroke="#ffcd32" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
		</svg>
		<slot></slot>
	</div>
</template>
<script type="text/javascript">
	export default {
		props: {
			radius:{
				type:Number,
				default: 0
			},
			percent:{
				type:Number,
				default: 0
			}
		},
		data() {
			return {
				dashArray: Math.PI * 100
			}
		},
		computed: {
			dashOffset() {
				return (1 - this.percent) * this.dashArray
			}
		}
	}
</script>
<style type="text/css" scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	.pregress-circle
		position:relative
		#svgWrap
			transform:rotate(-90deg)
			position:absolute
			left:0
			top:0
			.circle
				stroke-width:8px
				transform-origin: center
				transform:scale(0.9)
</style>