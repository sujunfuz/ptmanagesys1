import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/merAccountAuthRecord/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/merAccountAuthRecord/pageList', params })
}

// 账户认证修改
export const editApi = (params: any) => {
  return request.get<any>({ url: '/merAccountAuthRecord/edit', params })
}
