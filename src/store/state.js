/*
	所有状态管理，Vuex 使用单一状态树——是的，用一个对象就包含了全部的应用层级状态。
	至此它便作为一个“唯一数据源 (SSOT)”而存在。
	这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，
	在调试的过程中也能轻易地取得整个当前应用状态的快照
 */
import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'
const state = {
	singer: {},
	playing: false,
	fullScreen: false,
	playList: [],
	sequenceList: [],
	mode: playMode.sequence,
	currentIndex: -1,
	topList: {},
	searchHistory: loadSearch()
}

export default state
