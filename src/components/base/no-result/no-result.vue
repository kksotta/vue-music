<template lang="html">
  <div class="no-result">
    <div class="no-result-img"></div>
    <p class="tit">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6" >
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'
.no-result
  width:100%
  text-align: center
  .no-result-img
    width:64px
    height:64px
    margin:0 auto 20px
    bg-image('no-result')
    background-size: 100% 100%
  .tit
    text-align: center
    font-size: $font-size-medium
    color: $color-text-d
</style>
