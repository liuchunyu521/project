module.exports = {
	routes: [
		// 指标列表
		{
			name: 'index-info',
			path: '/hrdata/index',
			component: './src/index-info.vue'
		},
		// 指标数据列表
		{
			name: 'data-info',
			path: '/hrdata/data',
			component: './src/data-info.vue'
		},
		
	]
}