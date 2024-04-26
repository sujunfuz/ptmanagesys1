import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/news/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/news/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (params: any) => {
  return request.get<any>({ url: '/news/queryById', params })
}

// 根据id删除
export const deleteListByIdApi = (data: any) => {
  return request.delete<any>({ url: '/news/delete', data })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/news/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/news/edit', data })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/newsType/delete', data })
}

// 获取所有类型
export const getListAllApi = () => {
  return request.get<any>({ url: '/newsType/listAll' })
}
