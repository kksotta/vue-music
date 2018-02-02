<template>
	<div class="rank" ref="rank">
		<scroll ref="scroll" :data="toplist" class="listwrap">
			<ul>
				<li class="item" v-for="el in toplist" @click="selectItem(el)">
					<div class="icon">
						<img v-lazy="el.picUrl" width="100%" height="100%">
					</div>
					<ul class="songlist">
						<li class="songs" v-for="(song, index) in el.songList">
							<span class="num">{{index + 1}}</span><span>{{song.songname}}-{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
		</scroll>
		<div class="loading-wrap" v-show="!toplist.length">
			<loading></loading>
		</div>
		<!-- 排行榜子路由 -->
		<router-view></router-view>
	</div>
</template>
<script type="text/javascript">
	import {getTopList} from 'api/topList'
	import scroll from 'components/base/scroll'
	import {ERR_OK} from 'api/config'
	import {playlistMixin} from 'common/js/mixin'
	import loading from 'components/base/loading'
	import {mapMutations} from 'vuex'
	export default {
		mixins: [playlistMixin],
		created() {
			this._getTopList()
		},
		data() {
			return {
				toplist:[]
			}
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.rank.style.bottom = bottom
				this.$refs.scroll.refresh()
			},
			_getTopList() {
				getTopList().then((res) => {
					if (res.code === ERR_OK) {
						this.toplist = res.data.topList
					}
				})
			},
			selectItem (item) {
				this.$router.push({
					path: `/rank/${item.id}`
				})
				this.setTopList(item)
			},
			...mapMutations({
				setTopList: 'SET_TOP_LIST'
			})
		},
		components: {
			scroll,
			loading
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/variable.styl'
	.rank
	    position: fixed
	    width: 100%
	    top: 89px
	    bottom: 0
	    overflow:hidden
	    .listwrap
	    	width:100%
	    	height:100%
	    	display:flex
	    	flex-direction:column
	    	padding:0 10px 0 20px
	    	box-sizing:border-box
	    	.item
	    		flex:1
	    		display:flex
	    		padding:10px 0
	    		.icon
	    			flex: 0 0 100px
	    			width:100px
	    			height:100px
	    			font-size:0
	    		.songlist
	    			flex:1
	    			padding:8px 15px
	    			font-size:$font-size-medium
	    			color:$color-text-d
	    			background-color:rgba(255,255,255,0.1)
	    			overflow:hidden
	    			.songs
	    				width:100%
	    				height:28px
	    				line-height:28px
	    				white-space:nowrap
	    				overflow:hidden
	    				text-overflow:ellipsis
	    				.num
	    					margin-right:4px
		.loading-wrap
			position:absolute
			left:0
			top:0
			width:100%
			height:100%
</style>
