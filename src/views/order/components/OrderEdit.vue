<script setup>
import { ref } from 'vue'
import { orderUpsertService } from '@/api/order.js'

const show = ref(false)

const formRef = ref('')
const formModel = ref({
	id: 0,
	userName: '',
	itemName: '',
	status: '',
	channel: '',
	desc: '',
	createBy: '',
	createTime: ''
})
const options = [
	{
		label: '成功',
		value: 1
	},
	{
		label: '失败',
		value: 0
	}
]

const channelOptions = [
	{
		label: '网页后台',
		value: 0
	},
	{
		label: '手动绑定',
		value: 1
	},
	{
		label: '市场购买',
		value: 2
	}
]

const date = new Date()
const open = row => {
	show.value = true
	formModel.value = { ...row }
	console.log(formModel.value.createTime)
	formModel.value.createTime = parseInt(formModel.value.createTime)
	console.log(formModel.value.createTime)
}
defineExpose({
	open
})
date.getTime()
const emit = defineEmits(['submit'])

const submit = async () => {
	await formRef.value.validate()
	await orderUpsertService(formModel.value).then(() => {
		window.$message.success('成功编辑订单！')
		emit('submit')
	})
	show.value = false
}
</script>

<template>
	<n-modal
		v-model:show="show"
		preset="card"
		title="编辑订单"
		style="width: 450px"
		:segmented="{ content: 'soft' }"
	>
		<template #default>
			<n-form size="small" ref="formRef" :model="formModel">
				<n-form-item label="用户名">
					<n-input v-model:value="formModel.userName" clearable></n-input>
				</n-form-item>
				<n-form-item label="项目名">
					<n-input v-model:value="formModel.itemName" clearable></n-input>
				</n-form-item>
				<n-form-item label="状态">
					<n-select v-model:value="formModel.status" :options="options" clearable />
				</n-form-item>
				<n-form-item label="绑定渠道">
					<n-select v-model:value="formModel.channel" :options="channelOptions" clearable />
				</n-form-item>
				<n-form-item label="创建人">
					<n-input v-model:value="formModel.createBy" clearable></n-input>
				</n-form-item>
				<n-form-item label="创建时间">
					<n-date-picker v-model:value="formModel.createTime" type="datetime" clearable />
				</n-form-item>
				<n-form-item label="详情">
					<n-input
						v-model:value="formModel.desc"
						type="textarea"
						clearable
						maxlength="30"
						show-count
					></n-input>
				</n-form-item>
			</n-form>
		</template>
		<template #footer>
			<div style="display: flex; justify-content: flex-end">
				<n-button ghost @click="show = false" size="medium">取消</n-button>
				<n-button type="primary" size="medium" style="margin-left: 10px" @click="submit"
					>确定</n-button
				>
			</div>
		</template>
	</n-modal>
</template>

<style scoped lang="scss">
.n-form {
	.n-form-item {
		width: 70%;
		margin: 0 auto;
	}
}
</style>
