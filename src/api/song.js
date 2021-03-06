import {commonParams} from './config.js'

import axios from 'axios'

export function getLyric(mid){
	const url = '/api/lyric'

	const data = Object.assign({}, commonParams, {
		pcachetime:+new Date(),
		songmid:mid,
		loginUin:0,
		hostUin:0,
		notice:0,
		platform:'yqq',
		needNewCode:0,
		format: 'json'
	})

	return axios.get(url, {
		params: data,
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}