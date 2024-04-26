import request from '@/config/axios'

//获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/finSettlement/settlePageTop' })
}

// 获取提现审核列表
export const getPageListApi = (data: any) => {
  return request.get<any>({ url: '/finSettlement/settlePageList', params: data })
}

// 获取提现审核详情
export const settleDetailApi = (data: any) => {
  return request.get<any>({ url: '/finSettlement/settleDetail', params: data })
}

// 审核
export const auditApi = (data: any) => {
  return request.post<any>({ url: '/finSettlement/audit', data })
}
