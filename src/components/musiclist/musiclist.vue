<template>
	<div class="music-list">
		<div class="head">
			<div class="backBtn" @click="getBack">
				<span class="icon icon-back"></span>
			</div>
		</div>
		<h2 class="title">{{title}}</h2>
		<div class="bgImage" :style="bgStyle" ref="bgimage">
			<!-- 播放按钮 -->
			<div class="play-wrapper" v-show="songs.length > 0" ref="playBtn">
				<div class="player">
					<i class="icon-play"></i>
					<span class="play-tit" @click="playRandom">随机播放全部</span>
				</div>
			</div>
			<!-- 遮罩 -->
			<div class="filter" ref="filter"></div>
		</div>
		<div class="layerwrap" ref="layer"></div>
		<scroll class="list" ref="list" :data="songs" :listenScroll="true" :probeType="3" @scroll="scroll">
			<div class="song-list-wrap">
				<songlist :songs="songs" @selected="selectItem" :rank="rank"></songlist>
			</div>
			<div class="loading-wrapper" v-show="!songs.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>
<script type="text/javascript">
	import scroll from 'components/base/scroll'
	import songlist from 'components/base/song-list'
	import {prefixStyle} from 'common/js/dom'
	import loading from 'components/base/loading'
	import {mapActions} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'

	const RESOLVE_HEIGHT = 40
	const transform = prefixStyle('transform')
	const backdrop = prefixStyle('backdrop-filter')

	export default {
		/**
		 * 组件内将创建mixin里边的方法
		 * 如果组件内有mixin中的方法
		 * mixin的方法将被覆盖
		 */
		mixins: [playlistMixin],
		props: {
			songs: {
				type: Array,
				default: []
			},
			title: {
				type: String,
				default: ''
			},
			bgImage: {
				type: String,
				default: ''
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				scrollY: 0
			}
		},
		computed: {
			bgStyle() {
				return `background-image: url(${this.bgImage})`
			}
		},
		mounted() {
			this.imageHeight = this.$refs.bgimage.clientHeight
			this.minTranslateY = -this.imageHeight + RESOLVE_HEIGHT
			this.$refs.list.$el.style.top = `${this.imageHeight}px`
		},
		components: {
			scroll,
			songlist,
			loading
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.list.$el.style.bottom = bottom
				this.$refs.list.refresh()
			},
			getBack() {
				this.$router.go(-1)
				return
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			selectItem(el, index) {
				console.log(el, index)
				this.selectPlay({
					list: this.songs,
					index: index,
				})
			},
			playRandom() {
				this.randomPlay({
					list: this.songs
				})
			},
			...mapActions([
				'selectPlay',
				'randomPlay'
			])
		},
		watch: {
			scrollY(y) {
				/* Math.max返回指定数字中的最大值 */
				let translateY = Math.max(this.minTranslateY, y)
				let zIndex = 0
				let scale = 1
				let blur = 0
				this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
				const percent = Math.abs(y / this.imageHeight)
				if (y > 0) {
					scale = 1 + percent
					zIndex = 10
				} else {
					blur = Math.min(20 * percent, 20)
				}
				this.$refs.filter.style[backdrop] = `blur(${blur}px)`
				if (y < this.minTranslateY) {
					zIndex = 10
					this.$refs.bgimage.style.height = `${RESOLVE_HEIGHT}px`
					this.$refs.bgimage.style.paddingTop = '0'
					this.$refs.playBtn.style.display = 'none'
				} else {
					this.$refs.bgimage.style.height = '0px'
					this.$refs.bgimage.style.paddingTop = '70%'
					this.$refs.playBtn.style.display = ''
				}

				this.$refs.bgimage.style.zIndex = zIndex
				this.$refs.bgimage.style[transform] = `scale(${scale})`
			}
		}
	}
</script>
<style type="text/css" scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	@import '~common/stylus/mixin'
	.music-list
		position:fixed
		z-index:100
		top:0
		left:0
		right:0
		bottom:0
		background-color:$color-background
		.backBtn
			position:absolute
			left:0
			top:6px
			z-index:30
			.icon
				display:block
				padding:10px
				font-size:$font-size-large-x
				color:$color-theme
		.title
			position:absolute
			top:0
			left:10%
			z-index:35
			height:40px
			line-height:40px
			width:80%
			nowrap()
			color:$color-text
			text-align:center
			font-size:$font-size-large
		.bgImage
			position:relative
			width:100%
			height:0
			padding-top:70%
			transform-origin:top
			background-size:cover
			.play-wrapper
				position:absolute
				left:50%
				bottom:30px
				transform:translate3d(-50%,0,0)
				height:30px
				line-height:30px
				padding:0 15px
				border:1px solid $color-theme
				border-radius:15px
				z-index:2
				.player
					width:100%
					box-sizing:border-box
					font-size:0
					.icon-play
						display:inline-block
						vertical-align:middle
						margin-right:6px
						font-size:$font-size-medium-x
					.play-tit
						display:inline-block
						vertical-align:middle
						font-size:$font-size-small
			.filter
				position:absolute
				left:0
				top:0
				width:100%
				height:100%
				background-color:rgba(0,0,0,0.3)
		.layerwrap
			position:relative
			height:100%
			background-color:$color-background
		.list
			position:fixed
			top:0
			bottom:0
			width:100%
			.song-list-wrap
				padding:20px 15px
			.loading-wrapper
				width:100%
				position:absolute
				top:0
				bottom:0
</style>
