<template>
  <transition>
    <div class="playlist" v-show="showflag" @click="hide">
      <div class="list-wrapper" @click.stop.prevent>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <div ref="listcontent" class="list-content">
          <ul>
            <li class="item">
              <i class="current"></i>
              <span class="text"></span>
              <span class="like"></span>
              <span class="delete"><i class="icon-delete"></i></span>
            </li>
          </ul>
        </div>

        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text"></span>
          </div>
        </div>
        <div class="list-close">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default{
    data() {
      return {
        showflag:false
      }
    },
    methods: {
      show() {
        this.showflag = true
      },
      hide() {
        this.showflag = false
      }
    }
  }
</script>

<style media="screen" scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .playlist
    position:fixed
    left:0
    top:0
    bottom:0
    right:0
    z-index:200
    background-color: $color-background-d
    &.list-fade-enter-active,&.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter,&.list-fade-leave-to
      opacity:0
      .list-wrapper
        transform: translate3d(0,100%,0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left:0
      bottom:0
      width:100%
      background-color:$color-highlight-background
      .list-header
        position:relative
        padding:20px 30px 10px 20px
        .title
          display:flex
          align-items: center
          .icon
            margin-right:10px
            font-size:30px
            color:$color-theme-d
          .text
            flex:1
            font-size:$font-size-medium
            color:$color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size:$font-size-medium
              color:$color-text-d
    .list-content
      max-height: 240px
      overflow:hidden
      .item
        display:flex
        align-items: center
        height:40px
        padding:0 30px 0 20px
        overflow:hidden
        .current
          flex:0 0 20px
          width:20px
          font-size:$font-size-small
          color:$color-theme-d
        .text
          flex:1
          no-wrap()
          font-size:$font-size-medium
          color:$color-text-d
        .like
          extend-click()
          margin-right: 15px
          font-size:$font-size-small
          color:$color-theme
          .icon-favorite
            color:$color-sub-theme
        .delete
          extend-click()
          font-size:$font-size-small
          color:$color-theme
    .list-operate
      width:140px
      margin:20px auto 30px
      .add
        display:flex
        align-items: center
        padding:8px 16px
</style>
