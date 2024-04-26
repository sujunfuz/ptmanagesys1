import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/finCardGroup/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/finCardGroup/pageList', params })
}

// 通过id查询
export const getPageListByIdApi = (params: any) => {
  return request.get<any>({ url: '/finCardGroup/queryById/' + params })
}

// 添加
export const addDataListApi = (data: any) => {
  return request.post<any>({ url: '/finCardGroup/add', data })
}

// 编辑
export const editDataListApi = (data: any) => {
  return request.put<any>({ url: '/finCardGroup/edit', data })
}

// 删除
export const deleteDataListApi = (data: any) => {
  return request.delete<any>({ url: '/finCardGroup/deleteBatchById', data })
}

// 更新卡组状态
export const getListAllApi = (id: any, str: any) => {
  return request.get<any>({ url: '/finCardGroup/updateCardGroupStatus/' + id + '/' + str })
}
