import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/logisticsManag/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/logisticsManag/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (ordNo: any) => {
  return request.get<any>({ url: `/logisticsManag/queryById/${ordNo}` })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/logisticsManag/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/logisticsManag/edit', data })
}

// 通过订单与物流号查询
export const queryEditByIdApi = (ordNo: any) => {
  return request.get<any>({ url: `/logisticsManag/queryEditById/${ordNo}/4{logisticsNo}` })
}

// 导出物流EXECL
export const exportApi = (data: any) => {
  return request.post<any>({ url: '/logisticsManag/exportBatchById', data, responseType: 'blob' })
}
