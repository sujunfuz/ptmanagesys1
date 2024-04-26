import request from '@/config/axios'

// 获取仓库列表
export const getNotDeliveryPageListApi = () => {
  return request.get({ url: '/sysNotDistributionArea/list' })
}

//获取表头
export const getNotDeliveryPageTopApi = () => {
  return request.get({ url: '/sysNotDistributionArea/pageTop' })
}

//更新不可配送
export const updateNotDeliveryApi = (data: any) => {
  return request.put({ url: '/sysNotDistributionArea/updateDistributionArea', data })
}
