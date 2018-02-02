<template>
	<div class="singer" ref="singer">
		<listview class="" :data="singers" @SelectItem="SelectSinger" ref="list"></listview>
		<router-view></router-view>
	</div>
</template>
<script type="">
	import {getSingerList} from 'api/singer-list'
	import singer from 'common/js/singer'
	import {ERR_OK} from 'api/config'
	import listview from 'components/base/listview'
	import {mapMutations} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'

	const HOT_NAME = '热门'
	const HOT_LENGTH = 12
	const OTHER_NAME = 9
	export default {
		mixins: [playlistMixin],
		data() {
			return {
				singers:[]
			}
		},
		created() {
			this._getSingerList()
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.list.$el.style.bottom = bottom
				this.$refs.list.refresh();
			},
			SelectSinger(item){
				this.$router.push({
					path: `/singer/${item.id}`
				})
				this.setSinger(item)
			},
			_getSingerList() {
				getSingerList().then((res) => {
					if (res.code === ERR_OK) {
						this.singers = this._resetSinger(res.data.list)
					}
				})
			},
			_resetSinger(list) {
				let map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				}
				list.forEach((el, index) => {
					if (index <= HOT_LENGTH) {
						map.hot.items.push(new singer({
							id: el.Fsinger_mid,
							name: el.Fsinger_name
						}))
					}
					const key = el.Findex
					if (!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push(new singer({
						id: el.Fsinger_mid,
						name: el.Fsinger_name
					}))
				})
				let hot = []
				let ret = []
				let other = []
				for (let k in map) {
					if (map[k].title.match(/[a-zA-Z]/)) {
						ret.push(map[k])
					}else if (map[k].title === HOT_NAME) {
						hot.push(map[k])
					}else if (map[k].title == OTHER_NAME) {
						other.push(map[k])
					}
				}
				ret.sort((a, b) => {
					return 	a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				ret[ret.length] = {
					title: '#',
					items: other[0].items
				}
				return hot.concat(ret)
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			})
		},
		components: {
			listview,
		},
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.listcontent
		width:100%
		position:fixed
		top:89px
		bottom:0
		overflow:hidden
</style>