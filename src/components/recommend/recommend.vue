<template>
	<div class="recommend" ref="recommend">
		<scroll ref="scroll" class="recommend-content" :data="discList">
			<div class="content">
				<div v-if="banner.length" class="sliderWrap">
					<slider>
						<div class="" v-for="el in banner">
							<a :href="el.linkUrl">
								<img :src="el.picUrl"  @load="loadImage">
							</a>
						</div>
					</slider>
				</div>
				<div class="recommendList">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li v-for="el in discList" class="item">
							<div class="icon">
								<img v-lazy="el.imgurl" width="60" height="60">
							</div>
							<div class="text">
								<h2 class="name" v-html="el.creator.name"></h2>
	               	 			<p class="desc" v-html="el.dissname"></p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</scroll>
		<div class="loadingWrapper" v-show="!discList.length">
			<loading class="wait"></loading>
		</div>
	</div>
</template>
<script type="text/javascript">
	import {getRecommend, getDiscList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	import Slider from 'components/recommend/slider'
	import Scroll from 'components/base/scroll'
	import loading from 'components/base/loading'
	import {playlistMixin} from 'common/js/mixin'

	export default {
		mixins: [playlistMixin],
		data() {
			return {
				banner:[],
				discList: []
			}
		},
		components: {
			slider: Slider,
			scroll: Scroll,
			loading
		},
		created() {
			this._getRecommend()
			this._getDiscList()
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.recommend.style.bottom = bottom
				this.$refs.scroll.refresh()
			},
			_getRecommend() {
				getRecommend().then((res) => {
					if(res.code === ERR_OK) {
						this.banner = res.data.slider
					}
				})
			},
			_getDiscList() {
				getDiscList().then((res) => {
					if(res.code === ERR_OK) {
						this.discList = res.data.list
					}
				})
			},
			loadImage() {
		        if (!this.checkloaded) {
	          		this.checkloaded = true
	          		this.$refs.scroll.refresh()
		        }
	      	},
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable.styl'
	.recommend
	    position: fixed
	    width: 100%
	    top: 89px
	    bottom: 0
	    overflow:hidden
	    .recommend-content
	    	height:100%
	    	overflow:hidden
			.recommendList
				width:100%
				overflow:hidden
				.list-title
					width:100%
					height:60px
					line-height:60px
					font-size:$font-size-large
					text-align:center
				ul
					width:100%
					.item
						display:flex
						box-sizing:border-box
						overflow:hidden
						color:$color-text
						padding:0 15px
						margin-bottom:20px
						.icon
							margin-right:18px
							font-size:0
						.text
							font-size:0
							display:flex
							flex-direction:column
							justify-content:center
							flex:1
							overflow:hidden
							font-size:$font-size-medium
							.name
								line-height:20px
								margin-bottom:10px
							.desc
								font-size:$font-size-small
								line-height:$font-size-medium-x
								color:$color-text-d
</style>