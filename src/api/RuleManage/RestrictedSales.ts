import request from '@/config/axios'

// top
export const pageTop = () => {
  return request.get({ url: '/ecGoodsSaleLimit/pageTop' })
}

// 列表
export const ecGoodsSaleLimitList = (data: any) => {
  return request.get({ url: '/ecGoodsSaleLimit/pageList', params: data })
}

// 通过id查询
export const ecGoodsSaleLimitDetails = (id: any) => {
  return request.get({ url: '/ecGoodsSaleLimit/queryById/' + id })
}

// 新增
export const addecGoodsSaleLimit = (data: any) => {
  return request.post({ url: '/ecGoodsSaleLimit/add', data: data })
}

// 编辑
export const editecGoodsSaleLimit = (data: any) => {
  return request.put({ url: '/ecGoodsSaleLimit/edit', data: data })
}

// 删除
export const delecGoodsSaleLimit = (data: any) => {
  return request.delete({ url: '/ecGoodsSaleLimit/deleteBatchById', data: data })
}

// 获取地区
export const getAllArea = () => {
  return request.get({ url: '/sysArea/getAllArea' })
}
