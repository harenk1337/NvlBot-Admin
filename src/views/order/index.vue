<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { h, ref } from 'vue'
import { NButton, NTag, NIcon } from 'naive-ui'
import { DeleteOutlineTwotone, EditNoteOutlined } from '@vicons/material'
import OrderEdit from '@/views/order/components/OrderEdit.vue'
import { orderPageQueryService, orderDeleteService } from '@/api/order.js'
import { formatTime } from '@/utils/format.js'

const loading = ref(false)
const modalRef = ref()
const selectOptions = [
	{
		label: '成功',
		value: '1'
	},
	{
		label: '失败',
		value: '0'
	}
]

const pagination = ref({})
const columns = [
	{
		title: '用户名',
		key: 'userName',
		fixed: 'left'
	},
	{
		title: '项目名',
		key: 'itemName'
	},
	{
		title: '状态',
		key: 'role',
		render(row) {
			return h(
				NTag,
				{ type: row.status === 1 ? 'success' : 'error' },
				{ default: () => (row.status === 1 ? '成功' : '失败') }
			)
		}
	},
	{
		title: '绑定渠道',
		key: 'channel',
		render(row) {
			return h(
				NTag,
				{ type: row.channel === 0 ? 'info' : row.channel === 1 ? 'success' : 'warning' },
				{
					default: () =>
						row.channel === 0 ? '网页后台' : row.channel === 1 ? '手动绑定' : '市场购买'
				}
			)
		}
	},
	{
		title: '创建人',
		key: 'createBy'
	},
	{
		title: '创建时间',
		key: 'createTime',
		render(row) {
			return h(NTag, { type: 'info' }, { default: () => formatTime(parseInt(row.createTime)) })
		}
	},
	{
		title: '详情',
		key: 'desc',
		align: 'center',
		width: 240,
		ellipsis: {
			tooltip: true
		}
	},
	{
		title: '操作',
		key: 'actions',
		fixed: 'right',
		align: 'right',
		width: 220,
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
const orderList = ref([])

const searchForm = ref({
	page: 1,
	pageSize: 10,
	userName: '',
	itemName: '',
	createBy: '',
	status: undefined
})

const queryOrderList = async () => {
	loading.value = true
	await orderPageQueryService(searchForm.value)
		.then(({ data }) => {
			orderList.value = data.records
			pagination.value.page = data.page
			pagination.value.pageSize = data.pageSize
			pagination.value.itemCount = data.itemCount
			pagination.value.pageCount = data.pageCount
		})
		.finally(() => (loading.value = false))
}
queryOrderList()

const handlePageChange = async currentPage => {
	searchForm.value.page = currentPage
	await queryOrderList()
}
const handleReset = async () => {
	searchForm.value.page = 1
	searchForm.value.userName = ''
	searchForm.value.itemName = ''
	searchForm.value.status = ''
	await handleSearch()
}
const handleSearch = async () => {
	searchForm.value.page = 1
	await queryOrderList()
}

const handleEdit = row => {
	modalRef.value.open(row)
}

const onSubmit = async () => await handleReset()

const currentId = ref(0)
const deleteRef = ref(false)
const handleDelete = row => {
	deleteRef.value = true
	currentId.value = row.id
}

const deleteSubmit = async () => {
	deleteRef.value = false
	await orderDeleteService(currentId.value).then(async () => {
		window.$message.success('成功删除订单！')
		await handleReset()
	})
}
</script>

<template>
	<page-container
		titleText="订单管理"
		@reset:btnClick="handleReset"
		@search:btnClick="handleSearch"
	>
		<template #search-form>
			<n-form inline :model="searchForm">
				<n-form-item>
					<n-input-group>
						<n-input-group-label>用户名</n-input-group-label>
						<n-input v-model:value="searchForm.userName" />
					</n-input-group>
				</n-form-item>
				<n-form-item>
					<n-input-group>
						<n-input-group-label>项目名</n-input-group-label>
						<n-input v-model:value="searchForm.itemName" />
					</n-input-group>
				</n-form-item>
				<n-form-item>
					<n-input-group>
						<n-input-group-label>创建人</n-input-group-label>
						<n-input v-model:value="searchForm.createBy"></n-input>
					</n-input-group>
				</n-form-item>
				<n-form-item>
					<n-select
						v-model:value="searchForm.status"
						style="min-width: 120px; margin-left: 5px"
						:options="selectOptions"
						label-field="label"
						placeholder="请选择状态"
						clearable
					/>
				</n-form-item>
			</n-form>
		</template>

		<template #data-show>
			<n-data-table
				:scroll-x="1200"
				striped
				remote
				:loading="loading"
				style="margin-top: 20px"
				:columns="columns"
				:data="orderList"
				:pagination="pagination"
				@update:page="handlePageChange"
			/>
		</template>
	</page-container>
	<OrderEdit ref="modalRef" @submit="onSubmit"></OrderEdit>

	<n-modal
		v-model:show="deleteRef"
		preset="dialog"
		title="确认"
		content="你确认要删除该订单吗?"
		positive-text="确认"
		negative-text="取消"
		@negative-click="deleteRef = false"
		@positive-click="deleteSubmit"
	/>
</template>

<style scoped lang="scss">
.n-form-item {
	max-width: 220px;
}
</style>
