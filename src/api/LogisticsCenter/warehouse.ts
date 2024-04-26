import request from '@/config/axios'

// 获取仓库列表
export const getWarehouseListApi = (params: any) => {
  return request.get({ url: '/rpWarehouse/pageList', params })
}

//获取表头
export const getWarehousePageTopApi = () => {
  return request.get({ url: '/rpWarehouse/pageTop' })
}

//删除仓库
export const deleteWarehouseByBatchNoApi = (data: any) => {
  return request.delete({ url: '/rpWarehouse/deleteBatchById', data })
}

//获取全部地区信息
export const getAllAreaApi = () => {
  return request.get({ url: '/sysArea/getAllArea' })
}

//添加仓库
export const addWarehouseApi = (data: any) => {
  return request.post({ url: '/rpWarehouse/add', data })
}

//编辑仓库
export const editWarehouseApi = (data: any) => {
  return request.put({ url: '/rpWarehouse/edit', data })
}
