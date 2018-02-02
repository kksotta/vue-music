import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config.js'

export function getTopList() {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

	const data = Object.assign({}, commonParams, {
		uin:0,
		notice:0,
		platform:'h5',
		needNewCode:1,
		_: +new Date(),
	})

	return jsonp(url, data, options)
}

export function getMusicList(topId) {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		needNewCode: 1,
		tpl: 3,
		page: 'detail',
		type: 'top',
		topid: topId
	})

	return jsonp(url, data, options)
}
