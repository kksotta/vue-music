/*
使用常量替代 Mutation 事件类型

使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：

// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。
*/
// 设置歌手
export const SET_SINGER = 'SET_SINGER'
// 设置播放类型
export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'
// 设置播放器全屏
export const SET_FULL_SCREEN = 'SET_FULL_SCREEN'
// 设置播放列表
export const SET_PLAYLIST = 'SET_PLAYLIST'
// 设置随机播放列表
export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'
// 设置
export const SET_PLAY_MODE = 'SET_PLAY_MODE'
// 设置正在播放的歌曲索引值
export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'

export const SET_DISC = 'SET_DISC'

export const SET_TOP_LIST = 'SET_TOP_LIST'

export const SET_SEARCH_HISTORY = 'SET_SEARCH_HISTORY'

export const SET_PLAY_HISTORY = 'SET_PLAY_HISTORY'

export const SET_FAVORITE_LIST = 'SET_FAVORITE_LIST'