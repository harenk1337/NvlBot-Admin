import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/stores/index.js'

NProgress.configure({ showSpinner: false })

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
})

router.beforeEach(to => {
	NProgress.start()
	const userStore = useUserStore()

	if (to.path !== '/login' && !userStore.getUserInfo().token) {
		return '/login'
	}

	if (to.path === '/login' && userStore.getUserInfo().token) {
		return '/'
	}
})

router.afterEach(to => {
	NProgress.done()
	const title = import.meta.env.VITE_APP_TITLE
	document.title = `${title} - ${to.meta.title || title}`
})

export default router
