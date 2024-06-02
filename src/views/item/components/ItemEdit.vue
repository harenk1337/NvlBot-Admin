<script setup>
import { ref } from 'vue'
import { itemUpsertService } from '@/api/item.js'

const show = ref(false)

const formRef = ref('')
const formModel = ref({
	id: 0,
	name: '',
	code: '',
	apiId: '',
	apiKey: ''
})

const rules = {
	name: [
		{ required: true, message: '请输入项目名', trigger: 'blur' },
		{ pattern: /^\S{1,10}$/, message: '项目名应为长度为 1-10 的非空字符', trigger: 'blur' }
	],
	code: [
		{ required: true, message: '请输入项目代码', trigger: 'blur' },
		{
			pattern: /^[a-zA-Z0-9]{6}$/,
			message: '项目代码应为长度为 6 的字母和数字',
			trigger: 'blur'
		}
	],
	apiId: [
		{ required: true, message: '请输入Api Id', trigger: 'blur' },
		{ pattern: /^[0-9]{6}$/, message: 'Api Id 应为长度为 6 的字母和数字', trigger: 'blur' }
	],
	apiKey: [
		{ required: true, message: '请输入Api Key', trigger: 'blur' },
		{
			pattern: /^[a-zA-Z0-9]{25}$/,
			message: 'Api Key 应为 长度为 25 的字母和数字',
			trigger: 'blur'
		}
	]
}
const open = row => {
	show.value = true
	formModel.value = { ...row }
	formModel.value.apiId = formModel.value.apiId.toString()
}
defineExpose({
	open
})
const emit = defineEmits(['submit'])
const submit = async () => {
	await formRef.value.validate()
	await itemUpsertService(formModel.value).then(() => {
		const action = formModel.value.id ? '编辑' : '新增'
		window.$message.success(`成功${action}项目 ${formModel.value.name}！`)
		emit('submit')
	})
	show.value = false
}
</script>

<template>
	<n-modal
		v-model:show="show"
		preset="card"
		:title="formModel.id ? '编辑项目' : '新增项目'"
		style="width: 450px"
		:segmented="{ content: 'soft' }"
	>
		<template #header-extra>
			<n-button
				secondary
				type="primary"
				tag="a"
				href="https://en.neverlose.cc/market/api"
				target="_blank"
				>查询 API</n-button
			>
		</template>
		<template #default>
			<n-form size="large" ref="formRef" :model="formModel" :rules="rules">
				<n-form-item label="项目名" path="name">
					<n-input v-model:value="formModel.name" clearable />
				</n-form-item>
				<n-form-item label="项目代码" path="code">
					<n-input v-model:value="formModel.code" clearable />
				</n-form-item>
				<n-form-item label="Api Id" path="apiId">
					<n-input v-model:value="formModel.apiId" clearable />
				</n-form-item>
				<n-form-item label="Api Key" path="apiKey">
					<n-input v-model:value="formModel.apiKey" clearable />
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
