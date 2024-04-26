import request from '@/config/axios'

// top
export const pageTop = () => {
  return request.get({ url: '/ecGoodsPriceLimit/pageTop' })
}

// 列表
export const ecGoodsPriceLimitList = (data: any) => {
  return request.get({ url: '/ecGoodsPriceLimit/pageList', params: data })
}

// 详情
export const ecGoodsPriceLimitDetails = (id: any) => {
  return request.get({ url: '/ecGoodsPriceLimit/queryById/' + id })
}

// 新增
export const addecGoodsPriceLimit = (data: any) => {
  return request.post({ url: '/ecGoodsPriceLimit/add', data: data })
}

// 编辑
export const editecGoodsPriceLimit = (data: any) => {
  return request.put({ url: '/ecGoodsPriceLimit/edit', data: data })
}

// 删除
export const delecGoodsPriceLimit = (data: any) => {
  return request.delete({ url: '/ecGoodsPriceLimit/deleteBatchById', data: data })
}

// 获取类目通过等级
export const getCategoryByLevel = (data: any) => {
  return request.get({ url: '/category/getCategoryByLevel', params: data })
}
