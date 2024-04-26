import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/finPayChannel/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/finPayChannel/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (params: any) => {
  return request.get<any>({ url: '/finPayChannel/queryById/' + params.id })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/finPayChannel/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/finPayChannel/edit', data })
}

// 删除
export const deleteApi = (data: any) => {
  return request.delete<any>({ url: '/finPayChannel/deleteBatchById', data })
}

// 更新API配置
export const updateApiConfigApi = (data: any) => {
  return request.put<any>({ url: '/finPayChannel/updateApiConfig', data })
}

// 获取api配置
export const getApiConfigApi = (params: any) => {
  return request.get<any>({ url: '/finPayChannel/getApiConfig/' + params.id })
}
