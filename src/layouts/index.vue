<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
import {
	sysUserLogoutService,
	sysUserAvatarChangeService,
	sysUserUpsertService
} from '@/api/sysuser.js'
import { NAvatar, NIcon, NGradientText, darkTheme, zhCN, dateZhCN } from 'naive-ui'
import {
	AppsOutlined,
	ReorderOutlined,
	HomeOutlined,
	PeopleAltOutlined,
	VerifiedUserOutlined,
	EditNoteOutlined,
	LogOutOutlined,
	KeyboardArrowDownOutlined
} from '@vicons/material'
import { SunnyOutline, MoonOutline, LogoGithub } from '@vicons/ionicons5'
import themeOverrides from '@/settings.js'
const themeSwitch = ref(false)

const router = useRouter()
const activeKey = ref('')

const userStore = useUserStore()
const { id, account, avatarUrl, token } = userStore.getUserInfo()
const renderIcon = icon => {
	return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
	{
		label: '首页',
		key: '/home',
		icon: renderIcon(HomeOutlined)
	},
	{
		label: '用户管理',
		key: '/user',
		icon: renderIcon(PeopleAltOutlined)
	},
	{
		label: '项目管理',
		key: '/item',
		icon: renderIcon(AppsOutlined)
	},
	{
		label: '订单管理',
		key: '/order',
		icon: renderIcon(ReorderOutlined)
	}
]

const renderCustomHeader = () => {
	return h(
		'div',
		{
			style: 'display: flex; align-items: center; padding: 6px'
		},
		[
			h(NAvatar, {
				round: true,
				style: 'margin-right: 6px',
				src: avatarUrl
			}),
			h(
				NGradientText,
				{
					type: 'primary',
					size: 18
				},
				{
					default: () => h('strong', null, account)
				}
			)
		]
	)
}
const dropdownOptions = [
	{
		key: 'user',
		type: 'render',
		render: renderCustomHeader
	},
	{
		key: 'divider',
		type: 'divider'
	},
	{
		label: '更换头像',
		key: 'changeAvatar',
		icon: renderIcon(EditNoteOutlined)
	},
	{
		label: '修改密码',
		key: 'resetPwd',
		icon: renderIcon(VerifiedUserOutlined)
	},
	{
		label: '退出登录',
		key: 'logout',
		icon: renderIcon(LogOutOutlined)
	}
]
const handleClick = key => {
	router.push(key)
}
const handleLinkClick = () => {
	window.open('https://github.com/harenk1337')
}

const url = ref('')

const pwFormRef = ref('')
const pwForm = ref({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
})

const pwFormRules = {
	oldPassword: [
		{
			required: true,
			message: '请输入旧密码',
			trigger: 'blur'
		}
	],
	newPassword: [
		{
			required: true,
			message: '请输入新密码',
			trigger: 'blur'
		},
		{
			pattern: /^\S{5,12}$/,
			message: '密码必须为 5-12 位且不包含空格',
			trigger: 'blur'
		}
	],
	confirmPassword: [
		{
			required: true,
			message: '请再次输入新密码',
			trigger: 'blur'
		},
		{
			validator: (rule, value) => {
				if (value !== pwForm.value.newPassword) {
					return new Error('两次输入密码不一致')
				}
				return true
			},
			trigger: 'blur'
		}
	]
}

const logoutShow = ref(false)
const avatarShow = ref(false)
const resetPwShow = ref(false)
const handleDropMenuClick = key => {
	if (key === 'logout') {
		logoutShow.value = true
	} else if (key === 'changeAvatar') {
		url.value = avatarUrl
		avatarShow.value = true
	} else if (key === 'resetPwd') {
		resetPwShow.value = true
	}
}

const handleLogout = async () => {
	await sysUserLogoutService(token).then(async () => {
		userStore.clearUserInfo()
		window.$message.success('已退出登录!')
		avatarShow.value = false
		await router.push('/login')
	})
}

const handleAvatar = async () => {
	await sysUserAvatarChangeService({ id, avatarUrl: url.value }).then(async ({ data }) => {
		userStore.setUserInfo(data)
		window.$message.success('成功更新头像!')
		router.go(0)
		avatarShow.value = false
	})
}

const handleResetPw = async () => {
	await pwFormRef.value.validate()
	await sysUserUpsertService({
		account,
		oldPassword: pwForm.value.oldPassword,
		newPassword: pwForm.value.newPassword
	}).then(async () => {
		userStore.clearUserInfo()
		window.$message.success('成功修改密码!请重新登录!')
		resetPwShow.value = false
		await router.push('/login')
	})
}
</script>

<template>
	<n-config-provider
		:locale="zhCN"
		:date-locale="dateZhCN"
		:theme="themeSwitch ? darkTheme : undefined"
		:theme-overrides="themeOverrides"
	>
		<n-grid :cols="1" class="container">
			<n-gi>
				<n-layout>
					<n-layout-header>
						<n-flex justify="center" align="center">
							<n-split direction="horizontal" :default-size="0.8" :max="0.8" disabled>
								<template #1>
									<n-menu
										v-model:value="activeKey"
										mode="horizontal"
										:options="menuOptions"
										responsive
										@update:value="handleClick"
									/>
								</template>
								<template #2>
									<n-flex justify="end" align="center">
										<n-divider vertical></n-divider>
										<n-icon
											class="link-icon"
											@click="themeSwitch = !themeSwitch"
											size="20"
											:component="themeSwitch ? SunnyOutline : MoonOutline"
										/>
										<n-icon
											class="link-icon"
											:component="LogoGithub"
											size="20"
											@click="handleLinkClick"
										/>
										<n-avatar bordered round size="large" :src="avatarUrl" style="left: 10px" />
										<n-dropdown :options="dropdownOptions" @select="handleDropMenuClick">
											<n-icon class="link-icon" :component="KeyboardArrowDownOutlined" size="20" />
										</n-dropdown>
									</n-flex>
								</template>
							</n-split>
						</n-flex>
					</n-layout-header>
					<n-layout-content content-style="padding: 24px">
						<router-view />
					</n-layout-content>
				</n-layout>
			</n-gi>
		</n-grid>

		<n-modal
			v-model:show="logoutShow"
			preset="dialog"
			title="确认"
			content="确认退出登录？"
			positive-text="确认"
			negative-text="取消"
			@positive-click="handleLogout"
			@negative-click="logoutShow = false"
		>
		</n-modal>

		<n-modal
			v-model:show="avatarShow"
			preset="card"
			title="更改头像"
			style="width: 450px"
			:segmented="{ content: 'soft' }"
		>
			<template #default>
				<n-text>注意: 目前只支持在线 url 链接</n-text>
				<n-input v-model:value="url"></n-input>
			</template>
			<template #footer>
				<div style="display: flex; justify-content: flex-end">
					<n-button ghost @click="avatarShow = false" size="medium">取消</n-button>
					<n-button type="primary" size="medium" style="margin-left: 10px" @click="handleAvatar"
						>确定</n-button
					>
				</div>
			</template>
		</n-modal>

		<n-modal
			v-model:show="resetPwShow"
			preset="card"
			title="重置密码"
			style="width: 450px"
			:segmented="{ content: 'soft' }"
		>
			<template #default>
				<n-form ref="pwFormRef" :model="pwForm" :rules="pwFormRules" size="large">
					<n-form-item label="旧密码" path="oldPassword">
						<n-input
							v-model:value="pwForm.oldPassword"
							type="password"
							show-password-on="mousedown"
							placeholder="旧密码"
						/>
					</n-form-item>
					<n-form-item label="新密码" path="newPassword">
						<n-input
							v-model:value="pwForm.newPassword"
							type="password"
							show-password-on="mousedown"
							placeholder="新密码"
						/>
					</n-form-item>
					<n-form-item label="确认密码" path="confirmPassword">
						<n-input
							v-model:value="pwForm.confirmPassword"
							type="password"
							show-password-on="mousedown"
							placeholder="确认新密码"
						/>
					</n-form-item>
				</n-form>
			</template>
			<template #footer>
				<div style="display: flex; justify-content: flex-end">
					<n-button ghost @click="resetPwShow = false" size="medium">取消</n-button>
					<n-button type="primary" size="medium" style="margin-left: 10px" @click="handleResetPw"
						>确定</n-button
					>
				</div>
			</template>
		</n-modal>
	</n-config-provider>
</template>

<style scoped lang="scss">
.container {
	height: 100vh;
	.n-layout-header {
		height: 64px;
		padding: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		.n-flex {
			text-align: center;
		}
		.link-icon:hover {
			cursor: pointer;
		}
	}
	.n-layout-content {
		min-height: 100vh;
		background-color: rgba(128, 128, 128, 0.2);
	}
}
.n-form {
	.n-form-item {
		width: 80%;
		margin: 0 auto;
	}
}
</style>
