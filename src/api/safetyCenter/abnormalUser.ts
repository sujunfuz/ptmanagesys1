import request from '@/config/axios'
// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/safUserBehavior/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/safUserBehavior/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (params: any) => {
  return request.get<any>({ url: '/safUserBehavior/queryById/' + params })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/safUserBehavior/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/safUserBehavior/edit', data })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/safUserBehavior/deleteBatchById', data })
}

// 导出异常用户EXCEL
export const getListAllApi = (data: any) => {
  return request.post<any>({ url: '/safUserBehavior/exportExcel', data, responseType: 'blob' })
}

// 用户封存
export const setUserBanStatusApi = (params: any) => {
  return request.get<any>({ url: '/userInfo/setUserBanStatus/' + params })
}

// 详情
export const getUserDetailApi = (params: any) => {
  return request.get<any>({ url: '/safUserBehavior/getUserDetail/' + params })
}

// IP拉黑
export const safIpAddApi = (data: any) => {
  return request.post<any>({ url: '/safIp/add', data })
}
