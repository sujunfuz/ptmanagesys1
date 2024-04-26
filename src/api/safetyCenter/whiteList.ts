import request from '@/config/axios'
// ip
// 获取表头
export const getPageTopApi1 = () => {
  return request.get<any>({ url: '/safIp/pageTop' })
}

// 分页列表查询
export const getPageListApi1 = (params: any) => {
  return request.get<any>({ url: '/safIp/pageList', params })
}

// 通过id查询
export const getPageListByIdApi1 = (params: any) => {
  return request.get<any>({ url: '/safIp/queryById/' + params })
}

// 添加
export const addDataListApi1 = (data: any) => {
  return request.post<any>({ url: '/safIp/add', data })
}

// 编辑
export const editDataListApi1 = (data: any) => {
  return request.put<any>({ url: '/safIp/edit', data })
}

// 删除
export const deleteDataListApi1 = (data: any) => {
  return request.delete<any>({ url: '/safIp/deleteBatchById', data })
}

// 更新卡组状态
export const getListAllApi1 = (data) => {
  return request.post<any>({ url: '/safIp/updateIpType', data })
}

// 解除IP名单
export const releaseCardGroupList1 = (data) => {
  return request.post<any>({ url: '/safIp/releaseIpList', data })
}

// 卡组------------------------------------------------------------------------------
// 获取表头
export const getPageTopApi2 = () => {
  return request.get<any>({ url: '/safCardGroup/pageTop' })
}

// 分页列表查询
export const getPageListApi2 = (params: any) => {
  return request.get<any>({ url: '/safCardGroup/pageList', params })
}

// 通过id查询
export const getPageListByIdApi2 = (params: any) => {
  return request.get<any>({ url: '/safCardGroup/queryById/' + params })
}

// 添加
export const addDataListApi2 = (data: any) => {
  return request.post<any>({ url: '/safCardGroup/add', data })
}

// 编辑
export const editDataListApi2 = (data: any) => {
  return request.put<any>({ url: '/safCardGroup/edit', data })
}

// 删除
export const deleteDataListApi2 = (data: any) => {
  return request.delete<any>({ url: '/safCardGroup/deleteBatchById', data })
}

// 更新卡组状态
export const getListAllApi2 = (data) => {
  return request.post<any>({ url: '/safCardGroup/updateIpType', data })
}

// 解除卡组名单
export const releaseCardGroupList2 = (data) => {
  return request.post<any>({ url: '/safCardGroup/releaseCardGroupList', data })
}

// 银行卡-----------------------------------------------------------------
// 获取表头
export const getPageTopApi3 = () => {
  return request.get<any>({ url: '/safCard/pageTop' })
}

// 分页列表查询
export const getPageListApi3 = (params: any) => {
  return request.get<any>({ url: '/safCard/pageList', params })
}

// 通过id查询
export const getPageListByIdApi3 = (params: any) => {
  return request.get<any>({ url: '/safCard/queryById/' + params })
}

// 添加
export const addDataListApi3 = (data: any) => {
  return request.post<any>({ url: '/safCard/add', data })
}

// 编辑
export const editDataListApi3 = (data: any) => {
  return request.put<any>({ url: '/safCard/edit', data })
}

// 删除
export const deleteDataListApi3 = (data: any) => {
  return request.delete<any>({ url: '/safCard/deleteBatchById', data })
}

// 更新卡组状态
export const getListAllApi3 = (data) => {
  return request.post<any>({ url: '/safCard/updateIpType', data })
}

//获取卡组
export const finCardGroupListApi = () => {
  return request.get<any>({ url: '/finCardGroup/list' })
}

// 解除卡号名单
export const releaseCardGroupList3 = (data) => {
  return request.post<any>({ url: '/safCard/releaseCardList', data })
}
