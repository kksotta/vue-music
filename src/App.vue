<template>
    <div id="app">
        <Mhead></Mhead>
        <Tabs></Tabs>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script type="text/javascript">
    import mhead from './components/m-header/m-header'
    import menu from './components/tab/tab'
    import player from './components/player/player'
    export default {
        components: {
            Mhead: mhead,
            Tabs: menu,
            player
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import 'common/stylus/variable.styl'
  #app
    color: $color-theme
</style>
