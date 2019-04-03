module.exports = {
	routes: [
		// 我要转正
		{
			name: 'myRegApply',
			path: '/hrss/myRegApply',
			component: './src/myRegApply/my-reg-apply.vue'
		},
    // 我要离职
    {
      name: 'myDimissionApply',
      path: '/hrss/myDimissionApply',
      component: './src/myDimissionApply/my-dimission-apply.vue'
    },
    // 我要调动
    {
      name: 'myTransApply',
      path: '/hrss/myTransApply',
      component: './src/myTransApply/my-trans-apply.vue'
    }
	]
}