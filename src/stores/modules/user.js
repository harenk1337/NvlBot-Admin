import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
	'user',
	() => {
		const userInfo = ref({
			id: '',
			account: '',
			avatarUrl: '',
			token: ''
		})

		const getUserInfo = () => userInfo.value
		const setUserInfo = data => (userInfo.value = data)
		const clearUserInfo = () => (userInfo.value = {})

		return { userInfo, getUserInfo, setUserInfo, clearUserInfo }
	},
	{ persist: true }
)
