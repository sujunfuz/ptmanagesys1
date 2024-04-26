import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/rpCurrencyRule/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/rpCurrencyRule/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (id: any) => {
  return request.get<any>({ url: `/rpCurrencyRule/queryById/${id}` })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/rpCurrencyRule/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/rpCurrencyRule/edit', data })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/rpCurrencyRule/deleteBatchById', data })
}

// 获取所有类型
export const updateStatusApi = (params) => {
  return request.get<any>({ url: `/rpCurrencyRule/updateStatus`, params })
}

// 获取国际货币
export const getCurrencyApi = () => {
  return request.get<any>({ url: '/rpCurrency/getCurrency' })
}

// 获取默认货币
export const getDefaultCurrencyApi = () => {
  return request.get<any>({ url: '/rpCurrency/getDefaultCurrency' })
}
