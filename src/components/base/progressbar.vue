<template>
	<div class="progress-wrapper" ref="progressWrap" @click="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="temp"></div>
			<div class="progress-btn" ref="playBtn" @touchstart.prevent="Touchstart" @touchmove.prevent="Touchmove" @touchend.prevent="Touchend"></div>
		</div>
	</div>
</template>
<script type="text/javascript">
	const ProgressBtnWidth = 16

	export default {
		props: {
			percent: {
				type: Number,
				default: 0
			}
		},
		created() {
			this.touch = {}
		},
		methods: {
			Touchstart(e) {
				this.touch.initiated = true
				this.touch.startX = e.touches[0].pageX
				this.touch.left = this.$refs.progress.clientWidth
			},
			Touchmove(e) {
				if (!this.touch.initiated) {
					return
				}
				const deltaX = e.touches[0].pageX - this.touch.startX
				const offsetLeft = Math.min(this.$refs.progressWrap.clientWidth - ProgressBtnWidth, Math.max(0, (this.touch.left + deltaX)))
				this._offset(offsetLeft)
			},
			Touchend(e) {
				this.touch.initiated = false
				this._playedPercent()
			},
			progressClick(e) {
				/**
				 * 点击进度按钮时候，歌曲的播放进度有问题，获取的offsetX是按钮内的offsetX
				 */
				// this._offset(e.offsetX)
				let rect = this.$refs.progressWrap.getBoundingClientRect();
				let offsetWidth = e.pageX - rect.left
				this._offset(offsetWidth)
				this._playedPercent()
			},
			_offset(offsetLeft) {
				this.$refs.progress.style.width = `${offsetLeft}px`
				this.$refs.playBtn.style.left = `${offsetLeft}px`
			},
			_playedPercent(){
				const progressWidth = this.$refs.progressWrap.clientWidth - ProgressBtnWidth
				const playedWidth = this.$refs.progress.clientWidth
				const percent = playedWidth / progressWidth
				this.$emit('percentChange', percent)
			}
		},
		watch: {
			percent(val) {
				if (val > 0 && !this.touch.initiated) {
					const _width = this.$refs.progressWrap.clientWidth - ProgressBtnWidth
					let offsetLeft = _width * val
					this._offset(offsetLeft)
				}
			}
		}
	}
</script>
<style type="text/css" scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	.progress-wrapper
		width:100%
		padding:13px 0
		box-sizing:content-box
		.bar-inner
			width:100%
			height:4px
			background-color:$color-background-d
			font-size:0
			position:relative
		.progress
			z-index:3
			width:0
			height:4px
			position:absolute
			left:0
			top:0
			background-color:$color-theme
		.temp
			z-index:2
			width:0
			height:4px
			position:absolute
			left:0
			top:0
			background-color:$color-text-ll
		.progress-btn
			z-index:4
			width:16px
			height:16px
			box-sizing:border-box
			border-radius:50%
			border:2px solid $color-text
			position:absolute
			left:0
			top:-6px
			background-color:$color-theme
</style>