<template>
	<div class="searchWrapper">
		<div class="search-box-wrap">
			<searchbox ref="searchbox" @query="onQueryChange"></searchbox>
		</div>
		<div class="hot-key-wrap">
			<div class="shot-cut" v-show="!query">
				<div class="hot-key">
					<h1 class="title">热门搜索</h1>
					<ul>
						<li class="item" v-for="el in hotkey" @click="addQuery(el.k)">
							{{el.k}}
						</li>
					</ul>
				</div>
				<div class="search-history" v-show="searchHistory.length">
					<h1 class="title">
						<span class="text">搜索历史</span>
						<span class="clear" @click.stop="showConfirm"><i class="icon-clear"></i></span>
					</h1>
					<searchlist :searchs="searchHistory" @selectOne="addQuery" @deleteOne="deleteSearchHistory"></searchlist>
				</div>
			</div>
			<div class="suggest-box" v-show="query">
				<suggest :query="query" @select="setHistory(query)" @listScroll="inputBlur"></suggest>
			</div>
		</div>
		<confirm ref="confirm" title="是否删除所有搜索记录" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
		<router-view></router-view>
	</div>
</template>
<script type="text/ecmascript-6">
	import searchbox from 'components/base/search-box/search-box'
	import {getHotKey} from 'api/search'
	import {ERR_OK} from 'api/config'
	import suggest from 'components/suggest/suggest'
	import {mapActions, mapGetters} from 'vuex'
	import searchlist from 'components/base/search-list/search-list'
	import confirm from 'components/base/confirm/confirm'
	export default {
		created() {
			this._getHotKey()
		},
		data() {
			return {
				hotkey: [],
				query: ''
			}
		},
		computed: {
			...mapGetters([
				'searchHistory'
			])
		},
		methods: {
			_getHotKey() {
				getHotKey().then((res) => {
					if (res.code === ERR_OK) {
						this.hotkey = res.data.hotkey.splice(0, 10)
					}
				})
			},
			addQuery(query) {
				this.$refs.searchbox.setQuery(query)
			},
			onQueryChange(query) {
				this.query = query
			},
			inputBlur() {
				this.$refs.searchbox.blur()
			},
			showConfirm() {
				this.$refs.confirm.show()
			},
			...mapActions([
				'setHistory',
				'deleteSearchHistory',
				'clearSearchHistory'
			])
		},
		components: {
			searchbox,
			suggest,
			searchlist,
			confirm
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'
	.searchWrapper
		position: fixed
		width: 100%
		top: 89px
		bottom: 0
		padding:0 15px
		box-sizing: border-box
		overflow: hidden
		.hot-key-wrap
			position:fixed
			top:150px
			bottom:0
			right:15px
			left:15px
			.shot-cut
				height:100%
				overflow:hidden
				.hot-key
					.title
						margin-bottom: 15px
						font-size: $font-size-medium
						color: $color-text-l
					.item
						display:inline-block
						padding:5px 10px
						margin:0 15px 10px 0
						border-radius:6px
						background-color:$color-background-l
						font-size:$font-size-small-s
						color:$color-text-l
				.search-history
					margin-top: 15px
					.title
						margin-bottom: 15px
						font-size: $font-size-medium
						color: $color-text-l
						display: flex
						align-items: center
						.text
							flex:1
						.clear
							width:48px
							font-size:$font-size-small
							text-align: right
							extend-click()
			.suggest-box
				width:100%
				height:100%
				overflow:hidden
</style>
