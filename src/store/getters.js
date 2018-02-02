/*
获取state映射,从这里取数据
 */

/*
箭头函数的简写
 */

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
	return state.playList[state.currentIndex] || {}
}

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory
