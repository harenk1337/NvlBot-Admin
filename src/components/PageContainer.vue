<script setup>
import { RefreshOutlined, SearchOutlined } from '@vicons/material'
import { NButton, NIcon } from 'naive-ui'

defineProps({
	titleText: {
		required: true,
		type: String
	}
})
const emit = defineEmits(['reset:btn-click', 'search:btn-click'])
</script>

<template>
	<n-card class="main-card" hoverable :segmented="{ content: 'soft' }">
		<template #header>
			<strong>
				<span>{{ titleText }}</span>
			</strong>
		</template>
		<template #header-extra>
			<div class="extra"><slot name="extra"></slot></div>
		</template>
		<template #default>
			<n-card class="search-card" embedded bordered>
				<div style="display: flex; justify-content: space-between; align-items: center">
					<div>
						<slot name="search-form"></slot>
					</div>
					<div style="margin-right: 20px">
						<n-button ghost type="tertiary" size="medium" @click="emit('reset:btn-click')">
							<template #icon>
								<n-icon><RefreshOutlined /></n-icon>
							</template>
							重置
						</n-button>
						<n-button
							type="primary"
							size="medium"
							style="left: 10px"
							@click="emit('search:btn-click')"
						>
							<template #icon>
								<n-icon><SearchOutlined /></n-icon>
							</template>
							搜索
						</n-button>
					</div>
				</div>
			</n-card>
			<slot name="data-show"></slot>
		</template>
	</n-card>
</template>

<style scoped lang="scss">
.main-card {
	border-radius: 5px;
	height: 100%;
}
</style>
