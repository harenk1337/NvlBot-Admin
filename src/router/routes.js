export const routes = [
	{
		path: '/login',
		meta: {
			title: '登录页'
		},
		component: () => import('@/views/login/index.vue')
	},
	{
		path: '/',
		component: () => import('@/layouts/index.vue'),
		redirect: '/home',
		children: [
			{
				path: '/home',
				meta: {
					title: '首页'
				},
				component: () => import('@/views/HomePage.vue')
			},
			{
				path: '/user',
				meta: {
					title: '用户管理'
				},
				component: () => import('@/views/user/index.vue')
			},
			{
				path: '/item',
				meta: {
					title: '项目管理'
				},
				component: () => import('@/views/item/index.vue')
			},
			{
				path: '/order',
				meta: {
					title: '订单管理'
				},
				component: () => import('@/views/order/index.vue')
			}
		]
	},
	{
		path: '/404',
		name: '404',
		meta: {
			title: '404'
		},
		component: () => import('@/views/404Page.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		name: '任意路由',
		redirect: '/404'
	}
]
