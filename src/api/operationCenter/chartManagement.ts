import request from '@/config/axios'

// 列表Top查询
export const postPageTopApi = () => {
  return request.post<any>({ url: '/goods/banner/pageTop' })
}

// 列表List查询
export const postPageListApi = (data: any) => {
  return request.post<any>({ url: '/goods/banner/pageList', data })
}

// 轮播图删除
export const deleteApi = (data: any) => {
  return request.delete<any>({ url: '/goods/banner/delete', data })
}

// 轮播图添加
export const addApi = (data: any) => {
  return request.post<any>({ url: '/goods/banner/add', data })
}

// 工厂list获取
export const getFactoryListApi = (data: any) => {
  return request.post<any>({ url: '/goods/banner/getFactoryList', data })
}

// 商品list获取
export const getGoodsListApi = (data: any) => {
  return request.post<any>({ url: '/goods/banner/getGoodsList', data })
}

// 轮播图修改
export const editApi = (data: any) => {
  return request.post<any>({ url: '/goods/banner/edit', data })
}

// 轮播图上下架
export const upOrDownApi = (data: any) => {
  return request.post<any>({ url: '/goods/banner/upOrDown', data })
}
