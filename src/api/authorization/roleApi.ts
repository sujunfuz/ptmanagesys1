import request from '@/config/axios'
import { string } from 'vue-types'

interface paginationType {
  pageSize: number
  currentPage: number
  [propName: string]: string | number
}
// 获取角色列表
export const getRoleListApi = (data: paginationType) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/pms/role/pageList' + str })
}

//获取该角色已有的菜单和全部菜单
export const getAssignMenuUIApi = (data: { id: string }) => {
  return request.get({ url: '/pms/role/assignMenuUI?id=' + data.id })
}

// 修改角色的拥有的菜单
export const editAssignMenuApi = (data: { ids: string; id: string }) => {
  return request.post({ url: '/pms/role/assignMenu', data })
}

//获取该角色已有的权限和全部权限
export const getAssignPermissionUIApi = (data: { id: string }) => {
  return request.get({ url: '/pms/role/assignPermissionUI?id=' + data.id })
}

// 修改角色的拥有的权限
export const editAssignPermissionApi = (data: { ids: string; id: string }) => {
  return request.post({ url: '/pms/role/assignPermission', data })
}

// 获取添加角色所需要的数据
export const getRoleAddUIApi = () => {
  return request.get({ url: '/pms/role/addUI' })
}

//添加角色
export const addRoleApi = (data: {
  roleName: string
  remark: string
  menuIds: string
  permissionIds: string
}) => {
  return request.post({ url: '/pms/role/add', data })
}

// 编辑角色
export const editRoleApi = (data) => {
  return request.post({ url: '/pms/role/edit', data })
}

// 获取字段分配列表
export const getRoleMenuListApi = (data: paginationType) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/pms/role/roleMenuList' + str })
}

//获取字段分配UI静态数据
export const getMenuColumnUIApi = (data: { roleId: string; menuId: string }) => {
  return request.get({
    url: `/pms/role/getMenuColumnUI?roleId=${data.roleId}&menuId=${data.menuId}`
  })
}
//保存字段分配的更改
export const saveRoleMenuColumnApi = (data: {
  roleId: string
  menuId: string
  columList: string
}) => {
  return request.post({ url: '/pms/role/saveRoleMenuColumn', data })
}

// 获取角色关联
export const getRoleRelationOperatorApi = (data: { id: string }) => {
  return request.get({
    url: `/pms/role/getRoleRelationOperator?id=${data.id}`
  })
}

//删除角色
export const deleteRoleApi = (data: { id: string }) => {
  return request.delete({
    url: `/pms/role/delete/${data.id}`
  })
}

//获取表头
export const getRolePageTopApi = () => {
  return request.get({ url: '/pms/role/pageTop' })
}

//点击下一步的字段分配列表
export const getMenuColumnListApi = (data) => {
  return request.post({ url: '/pms/role/menuColumnList', data})
}