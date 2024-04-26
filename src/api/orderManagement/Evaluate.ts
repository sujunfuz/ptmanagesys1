import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/evaluate/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/evaluate/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (params: any) => {
  return request.get<any>({ url: '/evaluate/queryById', params })
}

// 商家回复
export const replayApi = (data: any) => {
  return request.post<any>({ url: '/evaluate/reply', data })
}

// 申诉
export const appealApi = (data: any) => {
  return request.post<any>({ url: '/evaluate/appeal', data })
}

// 处理申诉
export const appealHandleApi = (data: any) => {
  return request.post<any>({ url: '/evaluate/appeal/handle', data })
}

// 申诉列表
export const appealListApi = (params: any) => {
  return request.get<any>({ url: '/evaluate/appeal/list', params })
}

// 申诉列表pageTop
export const appealListPageTopApi = () => {
  return request.get<any>({ url: '/evaluate/appeal/pageTop' })
}
