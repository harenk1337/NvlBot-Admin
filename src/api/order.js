import request from '@/utils/request.js'

export const orderPageQueryService = data => request.post('/order/list', data)

export const orderUpsertService = data => request.post('/order', data)

export const orderDeleteService = id => request.delete(`/order/${id}`)
