<template>
	<div class="loading">
		<div class="imgBox">
			<img src="./loading.gif">
		</div>
		<p class="tit" v-show="title">{{title}}</p>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			title: {
				type: String,
				default: '正在载入'
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.loading
		width:100px
		position:absolute
		left:50%
		top:50%
		transform:translate3d(-50%,-50%,0)
		.imgBox
			width:100%
			height:40px
			line-height:40px
			display:flex
			align-items:center
			img
				height:100%
				margin:0 auto
		.tit
			height:20px
			line-height:20px
			font-size:12px
			color:#fff
			text-align:center
</style>
