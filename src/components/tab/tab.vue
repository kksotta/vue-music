<template>
	<ul class="tap">
		<li class="tap-items">
			<router-link to="/recommend">推荐</router-link>
		</li>
		<li class="tap-items">
			<router-link to="/singer">歌手</router-link>
		</li>
		<li class="tap-items">
			<router-link to="rank">排行</router-link>
		</li>
		<li class="tap-items">
			<router-link to="search">搜索</router-link>
		</li>
	</ul>
</template>
<script>
	export default {}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/variable.styl'
	.tap
		display:flex
		width:100%
		height:40px
		line-height:40px
		padding-bottom:5px
		.tap-items
			flex:1
			width:25%
			text-align:center
			a
				padding:4px 5px
				&.router-link-active
					color:$color-theme
					border-bottom:2px solid $color-theme
</style>