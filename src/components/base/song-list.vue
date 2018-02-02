<template>
	<div class="song-list" ref='songlist'>
		<ul>
			<li class="item" v-for="(el, index) in songs" @click="selectItem(el,index)">
				<div class="rank-wrap" v-show="rank">
					<span :class="getRankCls(index)">{{getRankTxt(index)}}</span>
				</div>
				<div class="content">
					<h2 class="name">{{el.name}}</h2>
					<p class="desc">{{getDesc(el)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	export default {
		props: {
			songs: {
				type: Array,
				default: {}
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			getDesc(el) {
				return `${el.singer} · ${el.album}`
			},
			selectItem(el, index) {
				this.$emit('selected', el, index)
			},
			getRankCls(index) {
				if (index <= 2) {
					return `icon icon${index}`
				} else {
					return 'text'
				}
			},
			getRankTxt(index) {
				if (index > 2){
					return index + 1
				} else {
					return ''
				}
			}
		}
	}
</script>
<style type="text/css" scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	@import '~common/stylus/mixin'
	.song-list
		width:100%
		overflow:hidden
		.item
			width:100%
			font-size:0
			margin-bottom:10px
			display:flex
			&:last-child
				margin-bottom:0
			.rank-wrap
				flex:0 0 32px
				width: 32px
				text-align: center
				span
					display:inline-block
					width:100%
					height:100%
					line-height:40px
				.icon
					background-position: center
					background-repeat: no-repeat
					background-size: 56%
					&.icon0
						bg-image(first)
					&.icon1
						bg-image(second)
					&.icon2
						bg-image(third)
				.text
					font-size:$font-size-medium
					color:$color-theme
			.content
				flex:1
				.name
					font-size:$font-size-small
					line-height:$font-size-large-x
					color:$color-text
				.desc
					font-size:$font-size-small
					line-height:$font-size-large
					color:$color-text-d
</style>
