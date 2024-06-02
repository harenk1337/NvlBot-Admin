<script setup>
import { useUserStore } from '@/stores/index.js'
const userStore = useUserStore()
const { account, avatarUrl } = userStore.getUserInfo()
const githubUrl = import.meta.env.VITE_GITHUB_URL
</script>

<template>
	<n-card class="main-card" :bordered="false">
		<template #default>
			<n-grid :cols="7">
				<n-gi :span="2">
					<n-card
						class="card-item"
						size="huge"
						header-style="padding-left: 0;padding-right: 20px;margin-left: 20px"
						content-style="padding-left: 20px; padding-right: 20px"
					>
						<template #header>
							<div style="display: flex; align-items: center">
								<n-avatar style="margin-right: 20px" bordered round :src="avatarUrl" :size="64" />
								<n-ellipsis style="width: 160px">
									<n-gradient-text>
										<strong>Hello, {{ account }}！</strong>
									</n-gradient-text>
									<br />
									<n-text style="font-size: 14px; color: rgba(128, 128, 128, 0.8)"
										>当前用户: 超级管理员</n-text
									>
								</n-ellipsis>
							</div>
						</template>
						<template #default>
							<div style="color: rgba(128, 128, 128, 0.8)">
								与困难作斗争，虽然要历尽艰苦，但苦尽甘来，这也是一种乐事。<br />
							</div>
							<div style="color: rgba(128, 128, 128, 0.6); display: flex; justify-content: end">
								—— 徐特立
							</div>
						</template>
					</n-card>
				</n-gi>

				<n-gi :span="5" style="margin-left: 30px">
					<n-card class="card-item" size="large">
						<template #header>
							<n-text strong depth="3"> 🤖 欢迎使用 NvlBot Admin </n-text>
						</template>
						<template #header-extra>
							<n-button
								secondary
								type="primary"
								tag="a"
								href="https://en.neverlose.cc/market/api"
								target="_blank"
								>Neverlose Docs</n-button
							>
						</template>
						<template #default>
							<div style="color: rgba(128, 128, 128, 0.8)">
								这是一个使用 QQ 机器人对 Neverlose API 交互的后台管理面板。目前仅支持 Neverlose 市场
								API 的简单调用，如绑定项目给某个用户。期待 SK 和 Neverlose 放出 Lua
								支持后我会继续开发出更多功能。敬请期待!
							</div>
						</template>
						<template #footer>
							<div style="display: flex; justify-content: end">
								<n-button
									ghost
									type="primary"
									tag="a"
									href="https://en.neverlose.cc/market/api"
									target="_blank"
									>部署文档</n-button
								>
								<n-button
									tag="a"
									:href="githubUrl"
									target="_blank"
									type="primary"
									style="margin-left: 10px"
									>代码仓库</n-button
								>
							</div>
						</template>
					</n-card>
				</n-gi>
			</n-grid>
			<br />
			<n-card class="empty-card" hoverable bordered>
				<template #default>
					<div style="display: flex; position: relative; left: calc(50% - 12px); top: 25%">
						<div style="color: rgba(128, 128, 128, 0.3); font-size: 24px">暂无数据</div>
					</div>
				</template>
			</n-card>
		</template>
	</n-card>
</template>

<style scoped lang="scss">
.main-card {
	height: 100vh;
	background-color: rgba(255, 255, 255, 0);
	.card-item {
		height: 220px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
	.empty-card {
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		height: 70%;
		.n-empty {
			height: 100%;
		}
	}
}
</style>
