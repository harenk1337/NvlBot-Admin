<template>
	<div>
		<n-message-provider>
			<MessageApi />
			<router-view />
		</n-message-provider>
	</div>
</template>

<script setup>
import MessageApi from '@/components/MessageApi.vue'
</script>

<style lang="scss" scoped></style>
