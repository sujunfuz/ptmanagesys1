import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/merAccountHistory/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/merAccountHistory/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (params: any) => {
  return request.get<any>({ url: '/merAccountHistory/queryById', params })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/merAccountHistory/delete', data })
}

// 导出
export const exportMerAccountHistoryApi = (data) => {
  return request.post({
    url: '/merAccountHistory/exportMerAccountHistory',
    data,
    responseType: 'blob'
  })
}
