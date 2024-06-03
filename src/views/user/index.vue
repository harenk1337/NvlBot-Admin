<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { NButton, NIcon, NSwitch, NTag } from 'naive-ui'
import { DeleteOutlineTwotone, EditNoteOutlined, PlusOutlined, FileDownloadOutlined } from '@vicons/material'
import { h, ref } from 'vue'
import UserEdit from '@/views/user/components/UserEdit.vue'
import {
	userPageQueryService,
	userEnableService,
	userDisableService,
	userDeleteService
} from '@/api/user.js'

const modalRef = ref()
const pagination = ref({})

const loading = ref(false)

const tableRef = ref()
const handleExport = () => {
	tableRef.value?.downloadCsv({
		fileName: 'Users'
	})
}

const columns = [
	{
		title: '用户名',
		key: 'name'
	},
	{
		title: '用户QQ',
		key: 'account'
	},
	{
		title: '角色',
		key: 'role',
		render(row) {
			return h(
				NTag,
				{ type: row.role === 1 ? 'warning' : 'info' },
				{ default: () => (row.role === 1 ? '超管' : '用户') }
			)
		}
	},
	{
		title: '状态',
		key: 'enable',
		render: row =>
			h(
				NSwitch,
				{
					size: 'medium',
					value: row.status === 1,
					onUpdateValue: () => handleEnable(row)
				},
				{
					checked: () => '启用',
					unchecked: () => '禁用'
				}
			)
	},
	{
		title: '操作',
		key: 'actions',
		fixed: 'right',
		align: 'right',
		width: 320,
		render(row) {
			return [
				h(
					NButton,
					{
						size: 'medium',
						style: {
							marginRight: '10px'
						},
						type: 'primary',
						onClick: () => handleEdit(row)
					},
					{
						default: () => '编辑',
						icon: () => h(NIcon, null, { default: () => h(EditNoteOutlined) })
					}
				),
				h(
					NButton,
					{
						size: 'medium',
						type: 'error',
						onClick: () => handleDelete(row)
					},
					{
						default: () => '删除',
						icon: () => h(NIcon, null, { default: () => h(DeleteOutlineTwotone) })
					}
				)
			]
		}
	}
]

const userList = ref([])
const searchForm = ref({
	page: 1,
	pageSize: 10,
	name: '',
	account: '',
	role: ''
})
const queryUserList = async () => {
	loading.value = true
	await userPageQueryService(searchForm.value)
		.then(({ data }) => {
			userList.value = data.records
			pagination.value.page = data.page
			pagination.value.pageSize = data.pageSize
			pagination.value.itemCount = data.itemCount
			pagination.value.pageCount = data.pageCount
		})
		.finally(() => (loading.value = false))
}
queryUserList()
const handlePageChange = async currentPage => {
	searchForm.value.page = currentPage
	await queryUserList()
}
const handleEnable = async row => {
	if (row.status === 1) {
		await userDisableService(row.id).then(() => {
			row.status = 0
			window.$message.success('用户已禁用！')
		})
	} else {
		await userEnableService(row.id).then(() => {
			row.status = 1
			window.$message.success('用户已启用！')
		})
	}
}

const handleSearch = async () => {
	searchForm.value.page = 1
	await queryUserList()
}

const handleReset = () => {
	searchForm.value.page = 1
	searchForm.value.name = ''
	searchForm.value.account = ''
	searchForm.value.role = ''
	handleSearch()
}

const handleAdd = () => {
	modalRef.value.open({})
}
const handleEdit = row => {
	modalRef.value.open(row)
}
const onSubmit = async () => {
	await handleReset()
}

const currentId = ref(0)
const deleteRef = ref(false)
const handleDelete = row => {
	deleteRef.value = true
	currentId.value = row.id
}
const deleteSubmit = async () => {
	deleteRef.value = false
	await userDeleteService(currentId.value).then(async () => {
		window.$message.success('成功删除用户！')
		await handleReset()
	})
}
</script>

<template>
	<page-container
		titleText="用户管理"
		@reset:btnClick="handleReset"
		@search:btnClick="handleSearch"
	>
		<template #extra>
			<n-button ghost @click="handleExport">
				<template #icon>
					<n-icon><FileDownloadOutlined /></n-icon>
				</template>
				导出
			</n-button>
			<n-button type="primary" @click="handleAdd" style="margin-left: 10px">
				<template #icon>
					<n-icon><PlusOutlined /></n-icon>
				</template>
				新增
			</n-button>
		</template>

		<template #search-form>
			<n-form inline :model="searchForm">
				<n-form-item>
					<n-input-group>
						<n-input-group-label>用户名</n-input-group-label>
						<n-input v-model:value="searchForm.name" clearable />
					</n-input-group>
				</n-form-item>
				<n-form-item>
					<n-input-group>
						<n-input-group-label>用户QQ</n-input-group-label>
						<n-input v-model:value="searchForm.account" clearable />
					</n-input-group>
				</n-form-item>
				<n-form-item>
					<n-text>角色: </n-text>
					<n-select
						v-model:value="searchForm.role"
						style="width: 120px; margin-left: 5px"
						clearable
						label-field="label"
						placeholder="请选择角色"
						:options="[
							{
								label: '超管',
								value: 1
							},
							{
								label: '用户',
								value: 0
							}
						]"
					></n-select>
				</n-form-item>
			</n-form>
		</template>

		<template #data-show>
			<n-data-table
				ref="tableRef"
				striped
				remote
				:loading="loading"
				style="margin-top: 20px"
				:columns="columns"
				:data="userList"
				:pagination="pagination"
				@update:page="handlePageChange"
			/>
		</template>
	</page-container>
	<UserEdit ref="modalRef" @submit="onSubmit"></UserEdit>
	<n-modal
		v-model:show="deleteRef"
		preset="dialog"
		title="确认"
		content="你确认要删除该用户吗?"
		positive-text="确认"
		negative-text="取消"
		@negative-click="deleteRef = false"
		@positive-click="deleteSubmit"
	>
	</n-modal>
</template>

<style scoped lang="scss"></style>
