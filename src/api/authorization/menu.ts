import request from '@/config/axios'

// 菜单列表
export const menuList = (data: Object) => {
  return request.get({ url: '/menu/pageList', params: data })
}

// 菜单表头字段
export const menuPageTop = () => {
  return request.get({ url: '/menu/pageTop' })
}

// 添加菜单ui
export const addmenuUi = (params) => {
  return request.get({ url: '/menu/addUI', params })
}
// 添加菜单
export const addmenu = (data: any) => {
  return request.post({ url: '/menu/add', data })
}
// 编辑菜单
export const editmenu = (data) => {
  return request.post({ url: '/menu/edit', data })
}
// 编辑菜单UI
export const editUI = (data: any) => {
  return request.get({ url: '/menu/editUI', params: data })
}
// 删除菜单
export const delmenu = (id: any) => {
  return request.delete({ url: `/menu/delete/${id}` })
}

// 表列表
export const tableNameData = () => {
  return request.get({ url: '/menu/tableNameData' })
}

//数据库表字段详情
export const generatorUI = (data: Object) => {
  return request.get({ url: '/menu/generatorUI', params: data })
}

// 菜单生成字段
export const postGenerateColumn = (data: any) => {
  return request.post({ url: '/menu/generateColumn', data })
}

//自定义菜单字段UI
export const getGenerateColumn = (data: Object) => {
  return request.get({ url: '/menu/generateColumn', params: data })
}

//自定义菜单字段保存
export const saveMenuColumn = (data: any) => {
  return request.post({ url: '/menu/saveMenuColumn', data })
}

//拖拽排序接口
export const sortMenuApi = (data: any) => {
  return request.post({ url: '/menu/sortMenu', data })
}
