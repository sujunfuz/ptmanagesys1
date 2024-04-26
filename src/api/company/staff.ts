import request from '@/config/axios'

// 员工管理获取表头
export const getTopApi = () => {
  return request.get<any>({ url: '/merOperator/pageTop' })
}

// 员工管理分页列表查询
export const getListApi = (params: any) => {
  return request.get<any>({ url: '/merOperator/pageList', params })
}

// 员工管理通过id查询
export const getByIdApi = (id: any) => {
  return request.get<any>({ url: `/wmWarehouse/queryById/${id}` })
}

// 员工管理添加
export const addApi = (data: any) => {
  return request.post<any>({ url: '/merOperator/add', data })
}

// 员工管理编辑
export const editApi = (data: any) => {
  return request.post<any>({ url: '/merOperator/edit', data })
}

// 员工管理删除
export const deleteApi = (ids: any) => {
  return request.delete<any>({ url: `/merOperator/delete/${ids}` })
}

// 添加UI
export const getaddUI = (params: any) => {
  return request.get<any>({ url: '/merOperator/addUI', params })
}

// 编辑UI
export const geteditUI = (params: any) => {
  return request.get<any>({ url: '/merOperator/editUI', params })
}

// // 通过id查询
// export const geteditUI = (id: any) => {
//   return request.get<any>({ url: `/wmWarehouse/editUI/'${id}` })
// }

// 一键冻结
export const changeAllStatus = (params: any) => {
  return request.get<any>({ url: '/merOperator/changeAllStatus', params })
}

// 重置操作员密码
export const resetPwd = (data: any) => {
  return request.post<any>({ url: '/merOperator/resetPwd', data })
}

// 操作员字段分配分页查询
export const operatorMenuList = (params: any) => {
  return request.get<any>({ url: '/merOperator/operatorMenuList', params })
}

// 操作员字段分配UI
export const getMenuColumnUI = (params: any) => {
  return request.get<any>({ url: '/merOperator/getMenuColumnUI', params })
}

// 操作员分配字段
export const operatorSaveColumn = (data: any) => {
  return request.post<any>({ url: '/merOperator/operatorSaveColumn', data })
}

// 操作员自定义列UI
export const operatorSortColumnUI = (params: any) => {
  return request.get<any>({ url: '/merOperator/operatorSortColumnUI', params })
}

// 操作员自定义列
export const operatorSortColumn = (data: any) => {
  return request.post<any>({ url: '/merOperator/operatorSortColumn', data })
}
