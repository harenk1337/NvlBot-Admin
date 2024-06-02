import request from '@/utils/request.js'

export const itemPageQueryService = data => request.post('/item/list', data)

export const itemUpsertService = data => request.post('/item', data)

export const itemDeleteService = id => request.delete(`/item/${id}`)
