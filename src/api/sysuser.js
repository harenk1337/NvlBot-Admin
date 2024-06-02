import request from '@/utils/request.js'

export const sysUserLoginService = data => request.post('/sys/user/login', data)

export const sysUserLogoutService = token => request.post(`/sys/user/logout?token=${token}`)

export const sysUserAvatarChangeService = data => request.post('/sys/user/avatar', data)

export const sysUserUpsertService = data => request.put('/sys/user/reset', data)
