<template lang="html">
  <transition name="confirm-fade">
    <div class="confirm" @click.stop v-show="showModal">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{title}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn right" @click="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    data() {
      return {
        showModal: false
      }
    },
    methods: {
      show() {
        this.showModal = true
      },
      hide() {
        this.showModal = false
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      confirm() {
        this.hide()
        this.$emit('confirm')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity:1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    75%
      transform: scale(1.1)
    100%
      transform: scale(1)

  @import '~common/stylus/variable'

  .confirm
    position:fixed
    left:0
    top:0
    bottom:0
    right:0
    z-index: 999
    background-color: $color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-wrapper
      position:absolute
      top:50%
      left:50%
      transform: translate3d(-50%,-50%,0);
      z-index:1000
      .confirm-content
        width:270px
        border-radius:13px
        background-color:$color-highlight-background
        .text
          padding: 18px 15px
          line-height:22px
          text-align: center
          font-size: $font-size-large
          color:$color-text-l
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: $font-size-large
          .operate-btn
            flex:1
            line-height: 22px
            padding:10px 0
            border-top: 1px solid $color-background-d
            color:$color-text-d
            &.left
              border-right:1px solid $color-background-d
</style>
