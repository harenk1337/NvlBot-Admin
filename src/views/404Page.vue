<script setup></script>

<template>
	<n-result status="404" title="404 资源不存在" description="你找的页面走丢了~">
		<template #footer>
			<n-button type="primary" @click="$router.push('/')">返回首页</n-button>
		</template>
	</n-result>
</template>

<style scoped lang="scss">
.n-result {
	margin-top: 100px;
}
</style>
