<script setup>
import { ref } from 'vue'
import { userUpsertService } from '@/api/user.js'

const show = ref(false)

const formRef = ref('')
const formModel = ref({
	id: 0,
	name: '',
	account: '',
	role: 0,
	status: 0
})

const rules = {
	name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	account: [
		{ required: true, message: '请输入账号', trigger: 'blur' },
		{ pattern: /^\d{5,11}$/, message: 'QQ 应为长度为 5-11 的数字', trigger: 'blur' }
	]
}
const allowInput = value => !value || /^\d+$/.test(value)
const options = [
	{
		label: '超管',
		value: 1
	},
	{
		label: '用户',
		value: 0
	}
]

const open = row => {
	show.value = true
	formModel.value = { ...row }
}
defineExpose({
	open
})

const emit = defineEmits(['submit'])
const submit = async () => {
	await formRef.value.validate()
	await userUpsertService(formModel.value).then(() => {
		const action = formModel.value.id ? '编辑' : '新增'
		window.$message.success(`成功${action}用户 ${formModel.value.name} ！`)
		emit('submit')
	})
	show.value = false
}
</script>

<template>
	<n-modal
		v-model:show="show"
		preset="card"
		:title="formModel.id ? '编辑用户' : '新增用户'"
		style="width: 450px"
		size="medium"
		:segmented="{ content: 'soft' }"
	>
		<template #default>
			<n-form size="large" ref="formRef" :model="formModel" :rules="rules">
				<n-form-item label="用户名" path="name">
					<n-input v-model:value="formModel.name" clearable />
				</n-form-item>
				<n-form-item label="用户 QQ" path="account">
					<n-input v-model:value="formModel.account" :allow-input="allowInput" clearable />
				</n-form-item>
				<n-form-item label="用户角色">
					<n-select v-model:value="formModel.role" :options="options" clearable />
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
