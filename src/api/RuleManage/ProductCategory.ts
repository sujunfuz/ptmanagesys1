import request from '@/config/axios'

// pageTop
export const categoryTop = () => {
  return request.get({ url: '/category/pageTop' })
}

// 获取类目通过等级 (列表)
export const getCategoryByLevel = (data: any) => {
  return request.get({ url: '/category/getCategoryByLevel/', params: data })
}

// // 列表
// export const categoryList = (data: any) => {
//   return request.get({ url: '/category/list', params: data })
// }

// 详情
export const categoryDetails = (id: any) => {
  return request.get({ url: '/category/queryById/' + id })
}

// 新增
export const addcategory = (data: any) => {
  return request.post({ url: '/category/add', data })
}

// 修改
export const editcategory = (data: any) => {
  return request.post({ url: '/category/update', data })
}

// 删除
export const delcategory = (data: any) => {
  return request.delete({ url: '/category/delete', params: data })
}

// 检查关联
export const checkRel = (data: any) => {
  return request.get({ url: '/category/checkRel', params: data })
}

// 获取属性
export const getAttr = (data: any) => {
  return request.post({ url: '/attr/getAttr', data })
}

// 获取树型结构类目
export const getTree = (data: any) => {
  return request.get({ url: '/category/getTree', params: data })
}

// 类目排序
export const sortCategory = (data: any) => {
  return request.post({ url: '/category/sortCategory', data })
}
