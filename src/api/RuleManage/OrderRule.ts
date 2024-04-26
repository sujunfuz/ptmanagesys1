import request from '@/config/axios'

// top
export const pageTop = () => {
  return request.get({ url: '/rule/pageTop' })
}

// 获取售后规则
export const getAfterRule = () => {
  return request.get({ url: '/ecOrderRule/getAfterRule' })
}

// 获取库存规则
export const getInventoryRule = () => {
  return request.get({ url: '/ecOrderRule/getInventoryWarn' })
}

// 获取订单规则
export const getOrderRule = () => {
  return request.get({ url: '/ecOrderRule/getOrderRule' })
}

// 获取结算规则
export const getSettleRule = () => {
  return request.get({ url: '/ecOrderRule/getSettleRule' })
}

// 更新规则
export const updateRule = (data: any) => {
  return request.post({ url: '/ecOrderRule/updateRule', data })
}
