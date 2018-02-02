<template lang="html">
  <div class="search-box">
    <span class="icon-search"></span>
    <input ref="query" type="text" name="" class="box" v-model="query" :placeholder="placeholder">
    <span v-show="query" @click="clear" class="icon-dismiss"></span>
  </div>
</template>

<script type="text/exmascript-6">
import {debounce} from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created() {
    /*数据节流，延时请求数据*/
    this.$watch('query',debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable.styl'
  .search-box
    width:100%
    height:36px
    background-color: $color-background-l
    border-radius:4px
    margin-top: 10px
    display:flex
    align-items: center
    .icon-search
      font-size:$font-size-large-x
      color:$color-background-d
      padding:0 4px
    .box
      flex:1
      background-color: transparent
      font-size: $font-size-medium
      padding:2px 3px
      border:none
      color:#fff
    .icon-dismiss
      padding:10px 6px
      color:#000
</style>
