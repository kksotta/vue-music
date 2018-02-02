<template>
	<div class="player" v-show="playList.length > 0">
		<transition name="normal" @enter="enter" @afterEnter="afterEnter" @leave="leave" @afterLeave="afterLeave">
			<div class="normal-player" v-show="fullScreen">
				<div class="back-filter" :style="backGround"></div>
				<div class="top">
					<div class="back" @click="hidePlayer">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<!-- 唱片 -->
				<div class="disc" @touchstart.prevent="dtouchstart" @touchmove.prevent="dtouchmove" @touchend.prevent="dtouchend">
					<div class="disc-l" ref="descleft">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="[playing ? 'animated' : '']">
								<img :src="currentSong.image" class="image">
							</div>
						</div>
						<div class="play-lyric"> {{playingLyric}}</div>
					</div>
					<scroll class="lyric-r" ref="lyriclist" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrap">
							<div v-if="currentLyric">
								<p ref="lyricline" class="text" v-for="(el, index) in currentLyric.lines" :class="{'current' : currentLineNum === index}">{{el.txt}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active' : currentShow === 0}"></span>
						<span class="dot" :class="{'active' : currentShow === 1}"></span>
					</div>
					<div class="process-wrapper">
						<span class="time time-l">{{_format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progressbar :percent="percent" @percentChange="resetPercent"></progressbar>
						</div>
						<span class="time time-r">{{_format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left" @click="changeMode">
							<i :class="playMode"></i>
						</div>
						<div class="icon i-left" :class="disabledCls">
							<i class="icon-prev" @click.stop.prevent="prev"></i>
						</div>
						<div class="icon i-center" @click.stop="togglePlaying" :class="disabledCls">
							<i :class="[playing ? 'icon-pause' : 'icon-play']"></i>
						</div>
						<div class="icon i-right" :class="disabledCls">
							<i class="icon-next" @click.stop.prevent="next"></i>
						</div>
						<div class="icon i-right">
							<i class="icon-not-favorite"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="openPlayer">
				<div class="icon">
					<img :src="currentSong.image" width="40" height="40">
				</div>
				<div class="tit">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control" @click.stop="togglePlaying">
					<progresscircle :radius="30" :percent="percent">
						<i :class="miniIcon"></i>
					</progresscircle>
				</div>
				<div class="control" @click="showplaylist">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		<playlist ref="playlist"></playlist>
		<audio :src="currentSong.url" ref="audio" @canplay="ready" @error="" @ended="endPlaying" @timeupdate="updateTime"></audio>
	</div>
</template>
<script type="text/javascript">
	import {mapGetters, mapMutations} from 'vuex'
	import animations from 'create-keyframe-animation'
	import {prefixStyle} from 'common/js/dom'
	import progressbar from 'components/base/progressbar'
	import progresscircle from 'components/base/progresscircle'
	import {playMode} from 'common/js/config'
	import {shuffle} from 'common/js/util'
	import lyricparser from 'lyric-parser'
	import scroll from 'components/base/scroll'
	import playlist from 'components/playlist/playlist'

	const transform = prefixStyle('transform')

	export default {
		data() {
			return {
				songReady: false,
				currentTime: 0,
				bufferedTime: 0,
				currentLyric: null,
				currentLineNum: 0,
				currentShow: 0,
				playingLyric:''
			}
		},
		computed: {
			miniIcon() {
				return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
			},
			disabledCls() {
				return this.songReady ? '' : 'disabled'
			},
			playMode() {
				return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
			},
			percent() {
				return this.currentTime / this.currentSong.duration
			},
			backGround() {
				return this.currentSong.image ? `background-image:url(${this.currentSong.image})` : ''
			},
			...mapGetters([
				'fullScreen',
				'playList',
				'currentSong',
				'playing',
				'currentIndex',
				'mode',
				'sequenceList'
			])
		},
		created() {
			this.touch = {}
		},
		methods: {
			hidePlayer() {
				this.setFllScreen(false)
			},
			openPlayer() {
				this.setFllScreen(true)
			},
			prev() {
				if (!this.songReady) {
					return
				}
				let index = this.currentIndex - 1
				if (index === -1) {
					index = this.playList.length - 1
				}
				this.setPlayIndex(index)

				if (!this.playing) {
					this.togglePlaying()
				}

				this.songReady = false
			},
			next() {
				if (!this.songReady) {
					return
				}
				if (this.playList.length === 1) {
					this.loop()
				} else {
					let index = this.currentIndex + 1
					if (index === this.playList.length) {
						index = 0
					}
					this.setPlayIndex(index)

					if (!this.playing) {
						this.togglePlaying()
					}
				}

				this.songReady = false
			},
			ready() {
				this.songReady = true
			},
			resetPercent(percent) {
				this.$refs.audio.currentTime = this.currentSong.duration * percent
				if (!this.playing) {
					this.togglePlaying()
				}
				/**
				 * 拖动歌曲播放进度，需要同步歌词播放进度
				 */
				if (this.currentLyric) {
					this.currentLyric.seek(this.currentSong.duration * percent * 1000)
				}
			},
			changeMode() {
				const mode = (this.mode + 1) % 3
				this.setPlayMode(mode)
				let list = null
				if (mode === playMode.random) {
					list = shuffle(this.sequenceList)
				} else {
					list = this.sequenceList
				}
				this.resetCurrentIndex(list)
				this.setPlaylist(list)
			},
			resetCurrentIndex(list) {
				let index = list.findIndex((item) => {
					return item.id === this.currentSong.id
				})
				this.setPlayIndex(index)
			},
			getLyric() {
				this.currentSong.Lyric().then((lyric) => {
					this.currentLyric = new lyricparser(lyric, this.hanleLyric)

					if (this.playing) {
						this.currentLyric.play()
					}
				}).catch(() => {
					this.currentLyric = null
					this.playingLyric = '暂无歌词'
					this.currentLineNum = 0
				})
			},
			hanleLyric({lineNum, txt}) {
				this.currentLineNum = lineNum
				if (lineNum > 5) {
					let lineEl = this.$refs.lyricline[lineNum - 5]
					this.$refs.lyriclist.scrollToElement(lineEl, 1000)
				} else {
					this.$refs.lyriclist.scrollTo(0, 0)
				}
				this.playingLyric = txt
			},
			dtouchstart(e) {
				this.touch.initiated = true
				this.touch.hasMove = false
				const touch = e.touches[0]
				this.touch.startX = touch.pageX
				this.touch.startY = touch.pageY
			},
			dtouchmove(e) {
				if (!this.touch.initiated) {
					return
				}
				const touch = e.touches[0]
				const deltaX = touch.pageX - this.touch.startX
				const deltaY = touch.pageY - this.touch.startY
				if (Math.abs(deltaY) > Math.abs(deltaX)) {
					return
				}
				const left = this.currentShow === 0 ? 0 : -window.innerWidth
				const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
				this.touch.percent = Math.abs(width / window.innerWidth)
				this.$refs.lyriclist.$el.style[transform] = `translate3d(${width}px, 0, 0)`
				this.$refs.lyriclist.$el.style.transition = 'all 0s'
				this.$refs.descleft.style.opacity = 1 - this.touch.percent
				this.touch.hasMove = true
			},
			dtouchend(e) {
				let width,opacity
				if (!this.touch.hasMove) {
					this.touch.initiated = false
					return
				}
				if (this.currentShow === 0) {
					if (this.touch.percent > 0.2) {
						width = -window.innerWidth
						this.currentShow = 1
						opacity = 0
					} else {
						width = 0
						opacity = 1
					}
				} else {
					if (this.touch.percent < 0.8) {
						width = 0
						this.currentShow = 0
						opacity = 1
					} else {
						width = -window.innerWidth
						opacity = 0
					}
				}
				this.$refs.lyriclist.$el.style[transform] = `translate3d(${width}px, 0, 0)`
				this.$refs.lyriclist.$el.style.transition = 'all 0.3s'
				this.$refs.descleft.style.opacity = opacity
				this.touch.initiated = false
			},
			enter(el, done) {
				const {x, y, scale} = this._getPosAndScale()
				let animation = {
					0: {
						transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
					},
					60: {
						transform: 'translate3d(0,0,0) scale(1.1)'
					},
					100: {
						transform: 'translate3d(0,0,0) scale(1)'
					}
				}
				animations.registerAnimation({
					name: 'move',
					animation,
					presets: {
						duration: 500,
						easing: 'linear'
					}
				})

				animations.runAnimation(this.$refs.cdWrapper, 'move', done)
			},
			afterEnter(el) {
				animations.unregisterAnimation('move')
				this.$refs.cdWrapper.style.animation = ''
			},
			leave(el, done) {
				this.$refs.cdWrapper.style.transition = 'all 0.5s linear'

				const {x,y,scale} = this._getPosAndScale()

				this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`

				this.$refs.cdWrapper.addEventListener('transitionend', done)
			},
			afterLeave(el) {
				this.$refs.cdWrapper.style.transition = ''
				this.$refs.cdWrapper.style[transform] = ''
			},
			endPlaying() {
				if (this.mode === playMode.loop) {
					this.loop()
				} else {
					this.next()
				}
			},
			loop() {
				this.$refs.audio.currentTime = 0
				this.$refs.audio.play()
				/**
				 * 单曲循环播放结束需要将歌词播放时间置0
				 */
				if (this.currentLyric) {
					this.currentLyric.seek(0)
				}
			},
			togglePlaying() {
				if (!this.songReady) {
					return
				}
				this.setPlaying(!this.playing)
				if (this.currentLyric) {
					this.currentLyric.togglePlay()
				}
			},
			updateTime(e) {
				this.currentTime = e.target.currentTime
			},
			getBuffered(e) {
				console.log(e.target)
				// this.bufferedTime = e.target
				console.warn('正在缓冲：' + Math.round(e.target.buffered.end(0) / e.target.duration * 100) + '%');
			},
			showplaylist() {
				this.$refs.playlist.show()
			},
			_format(interval) {
				interval = interval | 0
				const min = interval / 60 | 0
				const sec = this._pad(interval % 60)
				return `${min}:${sec}`
			},
			_pad(num, n = 2) {
				let len = num.toString().length
				while (len < n) {
					num = '0' + num
					len++
				}
				return num
			},
			_getPosAndScale() {
				// 小图片中心点距离屏幕左边的距离
				const targetLeft = 40
				// 小图片中心点距离屏幕底部的距离
				const targetBottom = 30
				// 大图距离顶部的距离
				const bigTop = 80
				// 屏幕宽度
				const width = (window.innerWidth * 0.8) / 2
				const x = targetLeft - (window.innerWidth / 2)
				const y = window.innerHeight - bigTop - width -targetBottom

				const scale = targetLeft / (width * 2)

				return {
					x,
					y,
					scale
				}
			},
			...mapMutations({
				setFllScreen: 'SET_FULL_SCREEN',
				setPlaying: 'SET_PLAYING_STATE',
				setPlayIndex: 'SET_CURRENT_INDEX',
				setPlayMode: 'SET_PLAY_MODE',
				setPlaylist: 'SET_PLAYLIST'
			})
		},
		watch: {
			currentSong(newSong, oldSong) {
				if (newSong.id === oldSong.id) {
					return
				}
				/**
				 * 切歌曲之前先停止正在播放的歌词列表
				 */
				if (this.currentLyric) {
					this.currentLyric.stop()
				}
				setTimeout(() => {
					this.$refs.audio.play()
					this.getLyric()
				}, 1000)
			},
			playing(val) {
				const audio = this.$refs.audio
				this.$nextTick(() => {
					val ? audio.play() : audio.pause()
				})
			}
		},
		components: {
			progressbar,
			progresscircle,
			scroll,
			playlist
		}
	}
</script>
<style type="text/css" scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	@import '~common/stylus/mixin'

	@keyframes rotate
		0%
			transform:rotate(0)
		100%
			transform:rotate(360deg)
	.player
		height:0
		width:0
		.normal-player
			position:absolute
			left:0
			top:0
			right:0
			bottom:0
			background-color:$color-background
			z-index:150
			overflow:hidden
			&.normal-enter-active, &.normal-leave-active
				transition: all 0.5s
				.top, .bottom
					transition: all 0.5s cubic-bezier(0.86,0.18,0.82,1.32)
			&.normal-enter, &.normal-leave-to
				opacity: 0
				.top
					transform:translate3d(0, -100px, 0)
				.bottom
					transform:translate3d(0, 100px, 0)
			&.normal-after-leave
				display:none
			.back-filter
				position:absolute
				left:0
				top:0
				width:100%
				height:100%
				background-position:0 0
				background-size:100% 100%
				opacity:0.6
				filter:blur(20px)
				overflow:hidden
			.top
				position:relative
				margin-bottom:25px
				z-index:1
				.back
					position:absolute
					top:0
					left:6px
					z-index:50
					.icon-back
						display:block
						padding:9px
						font-size:$font-size-large-x
						color:$color-theme
						transform:rotate(-90deg)
				.title
					width:70%
					margin:0 auto
					line-height:40px
					text-align:center
					nowrap()
					font-size:$font-size-large
					color:$color-text
				.subtitle
					height:20px
					line-height:20px
					font-size:$font-size-small
					color:$color-text
					text-align:	center
			.disc
				position:absolute
				top:80px
				width:100%
				bottom:170px
				white-space:nowrap
				font-size:0
				z-index:2
				.disc-l
					display:inline-block
					vertical-align:top
					position:relative
					width:100%
					height:0
					padding-top:80%
					.cd-wrapper
						position:absolute
						top:0
						left:10%
						width:80%
						height:100%
						.cd
							width:100%
							height:100%
							box-sizing:border-box
							border-radius:50%
							border:10px solid rgba(255,255,255,0.1)
							overflow:hidden
							&.animated
								animation: rotate 20s linear infinite
							.image
								width:100%
								height:100%
					.play-lyric
						width:100%
						height:30px
						line-height:30px
						color:$color-text
						text-align:center
						font-size:$font-size-small
						position:absolute
						left:0
						bottom:-60px
				.lyric-r
					display:inline-block
					width:100%
					height:100%
					vertical-align:top
					overflow:hidden
					.lyric-wrap
						width:80%
						margin:0 auto
						.text
							width:100%
							height:32px
							line-height:32px
							font-size:$font-size-small
							color:$color-text-l
							text-align:center
							&.current
								color:$color-text
			.bottom
				position:absolute
				bottom:50px
				width:100%
				.dot-wrapper
					text-align:center
					font-size:0
					.dot
						display:inline-block
						margin:0 4px
						width:8px
						height:8px
						border-radius:50%
						background-color:$color-text-ll
						transition:all 0.5s
						&.active
							width:20px
							border-radius:4px
				.process-wrapper
					display:flex
					align-items:center
					width:80%
					margin:0 auto
					padding:10px 0
					.time
						color:$color-text
						font-size:$font-size-small
						flex:0 0 30px
						width:30px
						line-height:30px
						&.time-l
							text-align:left
						&.time-r
							text-align:right
					.progress-bar-wrapper
						flex:1
				.operators
					display:flex
					align-items:center
					.icon
						flex:1
						color:$color-theme
						&.disabled
							color:$color-theme-d
						i
							font-size:30px
						&.i-left
							text-align:right
						&.i-center
							text-align:center
							padding:0 20px
							i
								font-size:40px
						&.i-right
							text-align:left
							.icon-favorite
								color:$color-sub-theme
		.mini-player
			display:flex
			align-items:center
			position:fixed
			left:0
			bottom:0
			z-index:180
			width:100%
			height:60px
			background-color:$color-highlight-background
			&.mini-enter-active, &.mini-leave-active
				transition:all 0.5s
			&.mini-enter, &.mini-leave-to
				opacity:0
			.icon
				flex:0 0 40px
				width:40px
				padding:0 10px 0 20px
				img
					border-radius:50%
			.tit
				display:flex
				flex-direction:column
				justify-content: center
				flex:1
				line-height:20px
				overflow:hidden
				.name
					flex:1
					margin-bottom:2px
					no-wrap()
					font-size:$font-size-medium
					color:$color-text
				.desc
					no-wrap()
					font-size:$font-size-small
					color:$color-text-d
			.control
				flex: 0 0 30px
				width:30px
				padding:0 10px
				.icon-play-mini, .icon-pause-mini, .icon-playlist
					font-size:30px
					color:$color-theme-d
				.icon-mini
					font-size:32px
					position:absolute
					left:0
					top:0
</style>
