import request from '@/config/axios'

// 列表Top查询
export const getPageTopApi = () => {
  return request.get<any>({ url: '/rpRecommend/pageTop' })
}

// 列表List查询
export const getPageListApi = (data: any) => {
  return request.get<any>({ url: '/rpRecommend/pageList', params: data })
}

// 通过id查询
export const getQueryByIdApi = (data: any) => {
  return request.get<any>({ url: '/rpRecommend/queryById', params: data })
}

// 添加
export const addApi = (data: any) => {
  return request.post<any>({ url: '/rpRecommend/add', data })
}

// 编辑
export const editApi = (data: any) => {
  return request.put<any>({ url: '/rpRecommend/edit', data })
}

// 删除
export const deleteApi = (data: any) => {
  return request.delete<any>({ url: '/rpRecommend/deleteBatchById', data })
}

// 默认商品
export const getDefaultListApi = (data: any) => {
  return request.post<any>({ url: '/rpRecommend/getDefaultList', data })
}

// 添加运营商品-工厂
export const postAddOperatingApi = (data: any) => {
  return request.post<any>({ url: '/operating/add', data })
}

// 添加运营商品-工厂列表
export const postAddPageListOperatingApi = (data: any) => {
  return request.post<any>({ url: '/operating/addPageList', data })
}

// 添加运营商品-工厂UI
export const postAddUIOperatingApi = (data: any) => {
  return request.post<any>({ url: '/operating/addUI', data })
}

// 删除运营商品-工厂
export const postDeleteBatchByIdApi = (data: any) => {
  return request.post<any>({ url: '/operating/deleteBatchById', data })
}

// 修改运营商品-工厂
export const postEditApi = (data: any) => {
  return request.post<any>({ url: '/operating/edit', data })
}

// 运营商品-工厂列表
export const postPageListApi = (data: any) => {
  return request.post<any>({ url: '/operating/pageList', data })
}

// 运营商品-工厂
export const postPageTopApi = () => {
  return request.get<any>({ url: '/operating/pageTop' })
}
