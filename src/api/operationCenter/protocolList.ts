import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/pfProtocol/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/pfProtocol/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (id: any) => {
  return request.get<any>({ url: `/pfProtocol/queryById/${id}` })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/pfProtocol/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/pfProtocol/edit', data })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/pfProtocol/deleteBatchById', data })
}
