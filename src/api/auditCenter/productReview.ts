import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/ecSpuAudit/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/ecSpuAudit/pageList', params })
}

// 通过spuId查询审核记录
export const getAuditRecordBySpuIdApi = (id: any) => {
  return request.get<any>({ url: '/ecSpuAudit/getAuditRecordBySpuId/' + id })
}
// 通过id查询
export const getPageListByIdApi = (id: any) => {
  return request.get<any>({ url: '/ecSpuAudit/queryById/' + id })
}

// 审核
export const editApi = (data: any) => {
  return request.post<any>({ url: '/ecSpuAudit/audit', data })
}
