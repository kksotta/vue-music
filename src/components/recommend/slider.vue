<template>
	<div class="slide" ref="slide">
		<div class="slide-group" ref="slideGroup">
			<slot></slot>
		</div>
		<div class="dots" v-if="showDot">
			<span class="dot" v-for="(item, index) in dots" :class="{active : currentaPageIndex === index}"></span>
		</div>
	</div>
</template>
<script type="text/ecmascript">
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
	data() {
		return {
			dots: [],
			currentaPageIndex: 0
		}
	},
	props: {
		loop: {
			type: Boolean,
			default: true
		},
		autoPlay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 4000
		},
		showDot: {
			type: Boolean,
			default: true
		}
	},
	mounted() {
		setTimeout(() => {
			this._setSliderWidth()
			this._initDots()
			this._initSlider();

			if (this.autoPlay) {
				this._play()
			}
		},20)
		window.addEventListener('resize', () => {
				// 如果没有slider或者slider停止工作-->return
				if (!this.slider || !this.slider.enable) {
					return
				}
				// 重置定时任务
				clearTimeout(this.timer)
				this.resizeTimer = setTimeout(() => {
					if (this.slider.isTnTransition) {
						this._onScrollEnd()
					} else {
						if (this.autoPlay) {
							this._play()
						}
					}
					this.refresh()
				}, 80)
			})
	},
	activated(){
		if (!this.slider) {
			return
		}
		this.slider.enable()
		let pageIndex = this.slider.getCurrentPage().pageX
		if (pageIndex > this.dots.length) {
			pageIndex = pageIndex % this.dots.length
		}
		this.slider.goToPage(pageIndex, 0, 0)
		if (this.loop) {
			pageIndex -= 1
		}
		this.currentaPageIndex = pageIndex
		if (this.autoPlay) {
			this._play()
		}
	},
	deactivated() {
		this.slider.disable()
		clearTimeout(this.timer)
	},
	beforeDestroy() {
		this.slider.disable()
		clearTimeout(this.timer)
	},
	methods: {
		refresh() {
			this._setSliderWidth(true)
			this.slider.refresh()
		},
		next() {
			this.slider.next()
		},
		_setSliderWidth(isResize) {
			this.children = this.$refs.slideGroup.children

			let width = 0
			let SliderWidth = this.$refs.slide.clientWidth
			for (var i = 0; i < this.children.length; i++) {
				let child = this.children[i]
				addClass(child, 'slider-item')
				child.style.width = SliderWidth + 'px'
				width += SliderWidth
			}
			if (this.loop && !isResize) {
				width += 2 * SliderWidth
			}
			this.$refs.slideGroup.style.width = width + 'px'
		},
		_initSlider() {
			this.slider = new BScroll(this.$refs.slide, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: {
					loop: this.loop,
					threshold: 0.3,
					speed: 400
				},
				click: true
			})
			this.slider.on('scrollEnd', this._onScrollEnd)
			this.slider.on('touchend', () => {
				if (this.autoPlay) {
					this._play()
				}
			})
			this.slider.on('beforeScrollStart', () => {
				if (this.autoPlay) {
					clearTimeout(this.timer)
				}
			})
		},
		_initDots() {
			this.dots = new Array(this.children.length)
		},
		_play() {
			let pageIndex = this.slider.getCurrentPage().pageX + 1
			clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				this.slider.goToPage(pageIndex, 0, 400)
			}, this.interval)
		},
		_onScrollEnd() {
			let pageIndex = this.slider.getCurrentPage().pageX
			if (this.loop) {
				pageIndex -= 1
			}
			this.currentaPageIndex = pageIndex
			if (this.autoPlay) {
				this._play()
			}
		}
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.slide
	min-height: 1px
	width:100%
	position:relative
	overflow:hidden
	.slide-group
		position:relative
		overflow:hidden
		white-space:nowrap
		font-size:0
		.slider-item
			float:left
			box-sizing:border-box
			overflow:hidden
			text-align:center
			a
				display:inline-block
				width:100%
				text-decoration:none
				img
					display:block
					width:100%
	.dots
		position:absolute
		right:0
		left:0
		bottom:12px
		transform:translateZ(1px)
		text-align:center
		font-size:0
		.dot
			display:inline-block
			margin:0 4px
			width:8px
			height:8px
			border-radius:50%
			background-color:rgba(255,255,255,0.5)
			&.active
				width:20px
				border-radius:5px
				background-color:#fff
</style>