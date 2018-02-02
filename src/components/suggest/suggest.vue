<template lang="html">
  <scroll class="suggest" :data="result" :pullup="true" @scrollEnd="pullUpLoad" ref="scroll" :beforeScroll="true" @beforeScroll="listScroll">
    <ul>
      <li v-for="el in result" class="item" @click="selectItem(el)">
        <span class="icon" :class="getTypeIcon(el)"></span>
        <span class="name" v-html="getElTxt(el)"></span>
      </li>
      <loadings v-show="hasmore" :title="title"></loadings>
    </ul>
    <div class="no-result-wrap" v-show="!hasmore && result.length === 0">
      <no-result title="抱歉，未搜索到相关内容"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import scroll from 'components/base/scroll'
import loadings from 'components/base/loading'
import {mapMutations, mapActions} from 'vuex'
import Singer from 'common/js/singer'
import noResult from 'components/base/no-result/no-result'
const TYPE_SINGER = 'singer'
const PERPAGE = 30
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasmore: true,
      title: ''
    }
  },
  methods: {
    _search() {
      this.hasmore = true
      this.page = 1
      this.$refs.scroll.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._getResoult(res.data)
          this._checkmore(res.data)
        }
      })
    },
    getTypeIcon(el) {
      if (el.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getElTxt(el) {
      if (el.type === TYPE_SINGER) {
        return el.singername
      } else {
        return `${el.name}--${el.singer}`
      }
    },
    pullUpLoad() {
      if (this.hasmore) {
        this.page++
        search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._getResoult(res.data))
            this._checkmore(res.data)
          }
        })
      } else {
        return
      }
    },
    selectItem(el) {
      if (el.type === TYPE_SINGER) {
        const  singer = new Singer({
          id: el.singermid,
          name: el.singername
        })
        this.$router.push({
					path: `/search/${singer.id}`
				})
				this.setSinger(singer)
      } else {
        this.insertSong(el)
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    _getResoult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }

      if (data.song) {
        ret = ret.concat(this._normalLizeList(data.song.list))
      }

      return ret
    },
    _normalLizeList(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _checkmore(data) {
      const song = data.song
      if (!song.list.length || ((song.curnum + song.curpage * 20) > song.totalnum)) {
        this.hasmore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this._search()
    }
  },
  components: {
    scroll,
    loadings,
    noResult
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'
  .suggest
    width: 100%
    height:100%
    position:relative
    overflow:hidden
    ul
      width:100%
      font-size:0
      display: flex
      flex-direction: column
      .item
        flex: 1
        display: flex
        align-items: center
        color:$color-text-l
        padding:5px 0
        .icon
          font-size:$font-size-medium
          padding: 4px 6px
        .name
          flex:1
          font-size: $font-size-small
          padding:0 8px
          no-wrap()
    .loading
      position:initial
      transform: translate3d(0,0,0)
      width:100%
      text-align:center
    .no-result-wrap
      position:absolute
      left:50%
      top:50%
      transform:translate3d(-50%,-50%,0)
      width:100%
</style>
