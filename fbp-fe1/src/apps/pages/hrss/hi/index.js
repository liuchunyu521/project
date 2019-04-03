module.exports = {
	routes: [
		// 我的信息
		{
			name: 'myInfo',
			path: '/hrss/myInfo',
			component: './src/myInfo/myInfo.vue'
		},
		// 个人信息审核列表
		{
			name: 'setalter-info',
			path: '/hrss/setalter',
			component: './src/setalter/setalter-info.vue'
		},
		// 个人信息审核详情
		{
			name: 'setalter-detail',
			path: '/hrss/setalter/detail/:id',
			component: './src/setalter/setalter-detail.vue'
		}
	]
}