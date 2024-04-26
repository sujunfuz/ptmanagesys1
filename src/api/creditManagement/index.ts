import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/finMerCredit/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/finMerCredit/pageList', params })
}

// 获取平台利率
export const getInterestRateApi = () => {
  return request.get<any>({ url: '/finMerCredit/getInterestRate' })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/finMerCredit/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.post<any>({ url: '/finMerCredit/edit', data })
}
// 编辑
export const editBatchDataListApi = (data: any) => {
  return request.post<any>({ url: '/finMerCredit/editBatch', data })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/finMerCredit/delete', data })
}

//获取公司信息
export const getCompanyInfoApi = (params: any) => {
  return request.get<any>({ url: '/finMerCredit/getCompanyInfo', params })
}
