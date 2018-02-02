<template>
	<div class="header">
		<p class="title">
			<span class="icon"></span>
			<span class="tit">Vue-Music</span>
		</p>
	</div>
</template>
<script>
	export default {}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/variable'
	@import '../../common/stylus/mixin'
	.header
		width:100%
		position:relative
		text-align:center
		font-size:$font-size-large
		height:44px
		line-height:44px
		.icon
			display:inline-block
			width:30px
			height:32px
			bg-image('default')
			background-size:30px 32px
			background-repeat:no-repeat
			margin:6px 6px 0 0
			vertical-align:top
		.tit
			display:inline-block
			height:44px
			vertical-align:top
</style>