import request from '@/config/axios'

// 角色管理获取表头
export const getTopApi = () => {
  return request.get<any>({ url: '/merRole/pageTop' })
}

// 角色管理分页列表查询
export const getListApi = (params: any) => {
  return request.get<any>({ url: '/merRole/pageList', params })
}

// 菜单分配UI
export const assignMenuUI = (params: any) => {
  return request.get<any>({ url: '/merRole/assignMenuUI', params })
}

// 角色管理添加
export const addApi = (data: any) => {
  return request.post<any>({ url: '/merRole/add', data })
}

// 角色管理编辑
export const editApi = (data: any) => {
  return request.post<any>({ url: '/merRole/edit', data })
}

// 角色管理删除
export const deleteApi = (ids: any) => {
  return request.delete<any>({ url: `/merRole/delete/${ids}` })
}

// 添加UI
export const getaddUI = (params: any) => {
  return request.get<any>({ url: '/merRole/addUI', params })
}

// 字段分配列表
export const getRoleMenuListApi = (params: any) => {
  return request.get<any>({ url: '/merRole/roleMenuList', params })
}

// 角色字段分配UI
export const getMenuColumnUIApi = (params: any) => {
  return request.get<any>({ url: '/merRole/getMenuColumnUI', params })
}

// 角色冻结
export const freezeRole = (params: any) => {
  return request.get<any>({ url: '/merRole/freezeRole', params })
}

// 角色字段分配保存
export const saveRoleMenuColumnApi = (data: any) => {
  return request.post<any>({ url: '/merRole/saveRoleMenuColumn', data })
}


//点击下一步的字段分配列表
export const getMenuColumnListApi = (data) => {
  return request.post({ url: '/merRole/menuColumnList', data})
}