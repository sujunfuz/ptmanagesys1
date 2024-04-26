import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/finRepayRecord/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/finRepayRecord/pageList', params })
}

// 详情
export const detailApi = (params: any) => {
  return request.get<any>({ url: '/finRepayRecord/queryById', params })
}

// 审核
export const auditApi = (data: any) => {
  return request.put<any>({ url: '/finRepayRecord/audit', data })
}
