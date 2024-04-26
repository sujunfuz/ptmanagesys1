import request from '@/config/axios'

// 仓库管理获取表头
export const getTopApi = () => {
  return request.get<any>({ url: '/wmWarehouse/pageTop' })
}

// 仓库管理分页列表查询
export const getListApi = (params: any) => {
  return request.get<any>({ url: '/wmWarehouse/pageList', params })
}

// 仓库管理通过id查询
export const getByIdApi = (id: any) => {
  return request.get<any>({ url: `/wmWarehouse/queryById/${id}` })
}

// 仓库管理添加
export const addApi = (data: any) => {
  return request.post<any>({ url: '/wmWarehouse/add', data })
}

// 仓库管理编辑
export const editApi = (data: any) => {
  return request.put<any>({ url: '/wmWarehouse/edit', data })
}

// 仓库管理删除
export const deleteApi = (data: any) => {
  return request.delete<any>({ url: '/wmWarehouse/deleteBatchById', data })
}

// // 添加UI
// export const getaddUI = (params: any) => {
//   return request.get<any>({ url: '/wmWarehouse/addUI', params })
// }

// // 通过id查询
// export const geteditUI = (id: any) => {
//   return request.get<any>({ url: `/wmWarehouse/editUI/'${id}` })
// }
