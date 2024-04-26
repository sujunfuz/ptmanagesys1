import request from '@/config/axios'

// 账户设置
export const setAccountApi = () => {
  return request.get({ url: '/account/setAccount' })
}

// 修改密码
export const postUpdatePwdApi = (data) => {
  return request.post({ url: '/account/updatePwd', data })
}

// 修改头像
export const changeIconApi = (params) => {
  return request.get({ url: '/pms/operator/changeIcon', params })
}
