import request from '@/utils/request.js'

export const userPageQueryService = data => request.post('/user/list', data)

export const userUpsertService = data => request.post('/user', data)

export const userDisableService = id => request.put(`/user/disable/${id}`)

export const userEnableService = id => request.put(`/user/enable/${id}`)

export const userDeleteService = id => request.delete(`/user/${id}`)
