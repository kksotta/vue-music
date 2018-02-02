<template>
	<transition name="slide">
		<mlist :title="title" :bgImage="bgImage" :songs="song"></mlist>
	</transition>
</template>
<script type="text/javascript">
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from 'api/singer-list'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'
	import musiclist from 'components/musiclist/musiclist'
	export default {
		data() {
			return {
				song: []
			}
		},
		computed: {
			...mapGetters([
				'singer'
			]),
			title() {
				return this.singer.name
			},
			bgImage() {
				return this.singer.avatar
			}
		},
		created() {
			this._getDetail()
		},
		components: {
			mlist: musiclist
		},
		methods: {
			_getDetail(){
				if (!this.singer.id) {
					this.$router.go(-1)
					return
				}
				getSingerDetail(this.singer.id).then((res) => {
					if (res.code === ERR_OK) {
						this.song = this._normalLizeSongs(res.data.list)
					}
				})
			},
			_normalLizeSongs(list) {
				let ret = []
				list.forEach((el,i) => {
					if (el.musicData.songid && el.musicData.albummid) {
						ret.push(createSong(el.musicData))
					}
				})
				return ret
			}
		}
	}
</script>
<style type="text/css" scoped lang="stylus" rel="stylesheet/stylus">
	.slide-enter-active,.slide-leave-active
		transition:all 0.3s
	.slide-enter,.slide-leave-to
		transform:translate3d(100%,0,0)
</style>
