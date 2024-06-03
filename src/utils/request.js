import axios from 'axios'
import { useUserStore } from '@/stores/index.js'

const userStore = useUserStore()
const baseURL = import.meta.env.VITE_BASE_URL

const instance = axios.create({
	baseURL,
	timeout: 5000
})

instance.interceptors.request.use(
	config => {
		const { token } = userStore.getUserInfo()
		if (token) {
			config.headers.Authorization = token
		}
		return config
	},
	err => {
		window.$message.error('响应超时!')
		return Promise.reject(err)
	}
)

instance.interceptors.response.use(
	res => {
		if (res.data.code === 200) {
			return res.data
		}
		window.$message.error(res.data.message || '服务异常')
		return Promise.reject(res.data)
	},
	err => {
		const { status } = err.response
		switch (status) {
			case 401:
				window.$message.error('未登录,无权访问!')
				break
			case 403:
				window.$message.error('权限不足,请联系管理员!')
				break
			case 404:
				window.$message.error('请求资源不存在!')
				break
			case 500:
				window.$message.error('服务器异常!')
				break
			case 504:
				window.$message.error('服务器被吃了⊙﹏⊙∥')
				break
			default:
				window.$message.error('未知错误!')
		}
		return Promise.reject(err)
	}
)

export default instance
export { baseURL }
