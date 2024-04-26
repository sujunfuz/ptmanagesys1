import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/finServiceCharge/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/finServiceCharge/pageList', params })
}

// 获取通用服务费
export const getCommonChargeApi = () => {
  return request.get<any>({ url: '/finServiceCharge/getBossServiceCharge' })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/finServiceCharge/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/finServiceCharge/edit', data })
}

// 编辑通用服务费
export const editCommonChargeApi = (params) => {
  return request.get<any>({ url: '/finServiceCharge/updateBossServiceCharge', params })
}
// 批量编辑
export const editBatchDataListApi = (data: any) => {
  return request.post<any>({ url: '/finServiceCharge/editBatch', data })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/finServiceCharge/deleteBatchById', data })
}

//获取公司信息
export const getCompanyInfoApi = (params: any) => {
  return request.get<any>({ url: '/finMerCredit/getCompanyInfo', params })
}
