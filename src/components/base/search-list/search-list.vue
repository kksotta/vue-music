<template lang="html">
  <ul>
    <li class="item" v-for="el in searchs" @click="selectItem(el)">
      <span class="text" v-html="el"></span>
      <span class="delete" @click.stop="deleteOneSeach(el)"><i class="icon-delete"></i></span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
      props: {
        searchs: {
          type: Array,
          default: []
        }
      },
      methods: {
  			selectItem(el) {
  				this.$emit('selectOne', el)
  			},
  			deleteOneSeach(el) {
  				this.$emit('deleteOne', el)
  			},
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable.styl'
  ul
    .item
      width:100%
      display:flex
      align-items: center
      .text
        flex:1
        color:$color-text-l
        font-size:$font-size-medium
      .delete
        color:$color-text-l
        font-size:$font-size-small
        padding:8px 0 8px 8px
</style>
