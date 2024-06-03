<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { NButton, NIcon } from 'naive-ui'
import { DeleteOutlineTwotone, EditNoteOutlined, FileDownloadOutlined, PlusOutlined } from '@vicons/material'
import { h, ref } from 'vue'
import ItemEdit from '@/views/item/components/ItemEdit.vue'
import { itemPageQueryService, itemDeleteService } from '@/api/item.js'

const loading = ref(false)

const tableRef = ref()
const handleExport = () => {
	tableRef.value?.downloadCsv({
		fileName: 'Items'
	})
}

const modalRef = ref()

const pagination = ref({})

const columns = [
	{
		title: '项目名',
		key: 'name'
	},
	{
		title: '项目代码',
		key: 'code'
	},
	{
		title: 'Api ID',
		key: 'apiId'
	},
	{
		title: 'Api Key',
		key: 'apiKey'
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
const itemList = ref([])
const searchForm = ref({
	page: 1,
	pageSize: 10,
	name: ''
})
const queryItemList = async () => {
	loading.value = true
	await itemPageQueryService(searchForm.value)
		.then(({ data }) => {
			itemList.value = data.records
			pagination.value.page = data.page
			pagination.value.pageSize = data.pageSize
			pagination.value.itemCount = data.itemCount
			pagination.value.pageCount = data.pageCount
		})
		.finally(() => {
			loading.value = false
		})
}
queryItemList()
const handlePageChange = async currentPage => {
	searchForm.value.page = currentPage
	await queryItemList()
}

const handleSearch = async () => {
	searchForm.value.page = 1
	await queryItemList()
}
const handleReset = () => {
	searchForm.value.page = 1
	searchForm.value.name = ''
	handleSearch()
}

const handleAdd = () => {
	modalRef.value.open()
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
	await itemDeleteService(currentId.value).then(async () => {
		window.$message.success('成功删除项目！')
		await handleReset()
	})
}
</script>

<template>
	<page-container
		titleText="项目管理"
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
						<n-input-group-label>项目名</n-input-group-label>
						<n-input v-model:value="searchForm.name"></n-input>
					</n-input-group>
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
				:data="itemList"
				:pagination="pagination"
				@update:page="handlePageChange"
			/>
		</template>
	</page-container>
	<ItemEdit ref="modalRef" @submit="onSubmit"></ItemEdit>

	<n-modal
		v-model:show="deleteRef"
		preset="dialog"
		title="确认"
		content="你确认要删除该项目吗?"
		positive-text="确认"
		negative-text="取消"
		@negative-click="deleteRef = false"
		@positive-click="deleteSubmit"
	>
	</n-modal>
</template>

<style scoped lang="scss"></style>
