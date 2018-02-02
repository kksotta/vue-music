<template>
	<scroll class="listview" :data="data" ref="scroll" :listenScroll="true" :probeType="3" @scroll="scroll">
		<ul class="content">
			<li v-for="(group,index) in data " :data-index="index" class="group" ref="listgroup">
				<p class="title" v-html="group.title"></p>
				<ul class="group-el">
					<li @click="SelectItem(el)" v-for="el in group.items" class="items">
						<div class="imgBox"><img v-lazy="el.avatar" :alt="el.name"></div>
						<p class="name" v-html="el.name"></p>
					</li>
				</ul>
			</li>
		</ul>
		<div class="shotcutlist" @touchstart.stop.prevent="onShotCutStart" @touchmove.stop.prevent="onShutCutMove" @touchend.stop.prevent>
			<ul>
				<li class="item" v-for="(el,index) in shotcutlist" :data-index="index" :class="{'current' : currentIndex === index}">{{el}}</li>
			</ul>
		</div>
		<div class="fixedTit" v-show="fixedTit" ref="fixedTitle">
			<p class="tit" v-html="fixedTit"></p>
		</div>
		<div class="loadingWrapper" v-show="!data.length">
			<loading class="wait"></loading>
		</div>
	</scroll>
</template>
<script type="text/javascript">
	import scroll from 'components/base/scroll'
	import {getData} from 'common/js/dom'
	import loading from 'components/base/loading'
	const EL_HEIGHT = 18
	const TIT_HEIGHT = 28

	export default {
		created() {
			console.log(this.data)
			this.touch = {}
			this.listHeight = []
		},
		props: {
			data: {
				type: Array,
				default: [],
			}
		},
		data() {
			return {
				scrollY :-1,
				currentIndex: 0,
				diff: -1
			}
		},
		computed: {
			shotcutlist() {
				return this.data.map((group) => {
					return group.title.substring(0, 1)
				})
			},
			fixedTit() {
				if (this.scrollY > 0) {
					return ''
				}
				return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
			}
		},
		components: {
			scroll,
			loading
		},
		methods: {
			refresh() {
				this.$refs.scroll.refresh()
			},
			onShotCutStart(e) {
				let Index = getData(e.target, 'index')
				this.touch.y1 = e.touches[0].pageY
				this.touch.index = Index
				this._scrollTo(Index)
			},
			onShutCutMove(e) {
				let firstTouch = this.touch.y1
				this.touch.y2 = e.touches[0].pageY
				let delta = (this.touch.y2 - firstTouch) / EL_HEIGHT | 0
				let Index = parseInt(this.touch.index) + delta
				this._scrollTo(Index)
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			SelectItem(item) {
				this.$emit('SelectItem', item)
			},
			_calculateHieght(){
				this.listHeight = []
				const list = this.$refs.listgroup
				let h = 0
				this.listHeight.push(h)
				for (var i = 0; i < list.length; i++) {
					h += list[i].clientHeight
					this.listHeight.push(h)
				}
			},
			_scrollTo(index) {

				if (!index && index !== 0) {
					return
				}

				if (index < 0) {
					index = 0
				}else if (index > (this.listHeight.length - 2)) {
					index = this.listHeight.length - 2
				}

				this.scrollY = -this.listHeight[index]

				this.$refs.scroll.scrollToElement(this.$refs.listgroup[index], 100)
			},
		},
		watch: {
			data() {
				setTimeout(() => {
					this._calculateHieght()
				}, 20)
			},
			scrollY(newY) {
				const listHeight = this.listHeight
				/*
				当滚动到顶部
				 */
				if (newY >= 0) {
					this.currentIndex = 0
					return
				}
				/*
				滚动到中部
				 */
				for (let i=0; i < listHeight.length - 1; i++) {
					let h1 = listHeight[i]
					let h2 = listHeight[i + 1]
					if (-newY >= h1 && -newY < h2) {
						this.currentIndex = i
						this.diff = h2 + newY
						return
					}
				}
				/*
				滚动到底部
				 */
				this.currentIndex = listHeight.length - 1
			},
			diff(Val) {
				let fixTop = (Val > 0 && Val < TIT_HEIGHT) ? Val - TIT_HEIGHT : 0
				if (this.fixTop === fixTop) {
					return
				}
				this.fixTop = fixTop
				this.$refs.fixedTitle.style.transform = `translate3d(0,${fixTop}px,0)`
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable.styl'
	.listview
		position:fixed
		top:89px
		bottom:0
		width:100%
		overflow:hidden
		.content
			width:100%
			overflow:hidden
			.group
				width:100%
				display:inline-block
				.title
					height:28px
					line-height:28px
					font-size:$font-size-small-s
					color:$color-text-l
					background-color:rgba(255,255,255,0.1)
					padding-left:20px
				.group-el
					.items
						width:100%
						height:60px
						display:flex
						align-items:center
						.imgBox
							width:45px
							height:45px
							font-size:0
							overflow:hidden
							border-radius:50%
							margin:0 15px
							img
								width:100%
								height:100%
						.name
							color:$color-text-l
							font-size:$font-size-small
		.shotcutlist
			position:absolute
			right:0
			top:50%
			transform:translateY(-50%)
			width:20px
			padding:20px 0
			border-radius:10px
			z-index:21
			background-color: $color-background-d
			font-family:Helvetica
			text-align:center
			.item
				padding:3px
				line-height:1
				color:$color-text-l
				font-size:$font-size-small
				&.current
					color:$color-theme
		.fixedTit
			position:fixed
			left:0
			top:89px
			width:100%
			z-index:20
			height:28px
			line-height:28px
			background-color:$color-background
			.tit
				display:inline-block
				width:100%
				height:100%
				font-size:$font-size-small-s
				color:$color-text-l
				background-color:rgba(255,255,255,0.1)
				padding-left:20px
		.loadingWrapper
			position:fixed
			top:89px
			left:0
			bottom:0
			width:100%
</style>