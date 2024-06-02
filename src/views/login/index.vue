<script setup>
import { ref } from 'vue'
import { sysUserLoginService } from '@/api/sysuser.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'

const router = useRouter()

const loading = ref(false)
const formRef = ref()
const formValue = ref({
	account: '',
	password: ''
})

const rules = {
	account: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{
			min: 5,
			max: 10,
			message: '用户名必须是 5-10 位的字母或数字',
			trigger: 'blur'
		}
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{
			pattern: /^\S{5,12}$/,
			message: '密码必须为 5-12 位且不包含空格',
			trigger: 'blur'
		}
	]
}

const userStore = useUserStore()
const handleLogin = async () => {
	await formRef.value.validate()
	loading.value = true
	await sysUserLoginService(formValue.value)
		.then(async ({ data }) => {
			userStore.setUserInfo(data)
			loading.value = false
			window.$message.success('登录成功')
			await router.push('/')
		})
		.catch(() => {
			loading.value = false
		})
}
</script>

<template>
	<n-grid :cols="4" class="login-page">
		<n-gi :offset="1" :span="2" class="login-form">
			<n-card size="large" hoverable>
				<n-form ref="formRef" :model="formValue" size="large" :rules="rules">
					<n-form-item>
						<h1>登录</h1>
					</n-form-item>
					<n-form-item label="用户名" path="account">
						<n-input v-model:value="formValue.account" placeholder="请输入用户名" />
					</n-form-item>
					<n-form-item label="密码" path="password">
						<n-input type="password" v-model:value="formValue.password" placeholder="请输入密码" />
					</n-form-item>
					<n-form-item>
						<n-button
							type="primary"
							block
							bordered
							strong
							size="large"
							@click="handleLogin"
							:loading="loading"
							:disabled="loading"
							>登 录</n-button
						>
					</n-form-item>
				</n-form>
			</n-card>
		</n-gi>
	</n-grid>
</template>

<style scoped lang="scss">
.login-page {
	height: 100vh;
	background: url('@/assets/login_background.jpg') no-repeat fixed;
	background-size: cover;
	.n-card {
		min-width: 350px;
		max-width: 400px;
		position: relative;
		top: 25%;
		left: 25%;
		border-radius: 20px;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
	}
}
</style>
