import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config.js'
import axios from 'axios'

export function getRecommend() {
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

	const data = Object.assign({}, commonParams, {
		uin: 0,
		needNewCode: 1,
		platform: 'h5'
	})
	return jsonp(url, data, options)
}

export function getDiscList() {
	const url = '/api/getDiscList'

	const data = Object.assign({}, commonParams, {
		platform: 'yqq',
		loginUin: 0,
		hostUin: 0,
		sortId: 5,
		sin: 0,
		ein: 29,
		categoryId: 10000000,
		rnd: Math.random(),
		format: 'json'
	})
	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
