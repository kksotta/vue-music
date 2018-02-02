/*
通常是异步修改、异步操作、对mutation异步操作

Action 类似于 mutation，不同在于：

Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。
让我们来注册一个简单的 action：

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。
当我们在之后介绍到 Modules 时，你就知道 context 对象为什么不是 store 实例本身了。

实践中，我们会经常用到 ES2015 的 参数解构 来简化代码（特别是我们需要调用 commit 很多次的时候）：

actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
 */

import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    index = findIndex(randomlist, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = (({commit, state}, {list}) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomlist = shuffle(list)
  commit(types.SET_PLAYLIST, randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
})

export const insertSong = (({commit, state}, song) => {
  let playlist = state.playList.slice()
  let squenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  //记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否存在要插入的歌曲，如果有返回他的索引
  let fpIndex = findIndex(playlist, song)
  //设置插入歌曲的索引为正在播放歌曲索引的后一个
  currentIndex++
  // 从设置的currentIndex处插入歌曲
  playlist.splice(currentIndex, 0, song)
  // 如果列表存在这首歌曲
  if (fpIndex > -1) {
    if (currentIndex > fpIndex){
      // 如果当前歌曲的序号大于相同歌曲在列表的序号
      // 从查找到的索引处删除相同歌曲
      playlist.splice(fpIndex, 1)
      // 删除成功之后，当前索引值 减一
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }


  let currentSindex = findIndex(squenceList, currentSong) + 1
  let fsIndex = findIndex(squenceList, song)
  squenceList.splice(currentSindex, 0, song)

  if (fsIndex > -1) {
    //插入歌曲在相同歌曲之后
    if (currentSindex > fsIndex) {
      squenceList.splice(fsIndex, 1)
    } else {
      squenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, squenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
})


export const setHistory = (({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
})

export const deleteSearchHistory = (({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
})

export const clearSearchHistory = (({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
})
