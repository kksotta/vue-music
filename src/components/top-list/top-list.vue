<template lang="html">
  <transition name="slide">
    <musiclist :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></musiclist>
  </transition>
</template>

<script type="text/ecmascript-6">
import musiclist from 'components/musiclist/musiclist'
import {mapGetters} from 'vuex'
import {getMusicList} from '@/api/topList'
import {ERR_OK} from '@/api/config'
import {createSong} from 'common/js/song'
export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
    },
    ...mapGetters([
      'topList'
    ])
  },
  components: {
    musiclist
  },
  created() {
    if (!this.topList.id) {
      this.$router.go(-1)
    }
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._formatMusicList(res.songlist)
        }
      })
    },
    _formatMusicList(list) {
      let ret = []
      list.forEach((el,i) => {
        if (el.data.songid && el.data.albummid) {
          ret.push(createSong(el.data))
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition: all 0.3s ease
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
