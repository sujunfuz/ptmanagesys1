import request from '@/config/axios'

// 获取上级类目属性
export const getAttrByParentId = (data: any) => {
  return request.get({ url: '/attr/getAttrByParentId', params: data })
}

// top
export const pageTop = () => {
  return request.get({ url: '/attr/pageTop' })
}

// 列表
export const attrList = (data: any) => {
  return request.get({ url: '/attr/list', params: data })
}

// 详情
export const attrDetails = (id: any) => {
  return request.get({ url: '/attr/queryById/' + id })
}

// 新增
export const addattr = (data: any) => {
  return request.post({ url: '/attr/add', data: data })
}

// 编辑
export const editattr = (data: any) => {
  return request.post({ url: '/attr/update', data: data })
}

// 删除
export const delattr = (data: any) => {
  return request.delete({ url: '/attr/delete', data: data })
}

// 获取属性
export const getAttr = (data: any) => {
  return request.post({ url: '/attr/getAttr', data: data })
}
