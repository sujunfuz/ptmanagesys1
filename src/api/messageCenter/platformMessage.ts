import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/messageNotify/pageTop' })
}

// 列表查询
export const getPageListApi = (data: any) => {
  return request.get<any>({ url: '/messageNotify/pageList', params: data })
}

// 添加
export const addApi = (data: any) => {
  return request.post<any>({ url: '/messageNotify/add', data })
}

// 编辑
export const editApi = (data: any) => {
  return request.put<any>({ url: '/messageNotify/edit', data })
}

// 通过id批量删除
export const deleteApi = (data: any) => {
  return request.delete<any>({ url: '/messageNotify/deleteBatchById', data })
}

// 全部已读
export const allReadApi = (data: any) => {
  return request.post<any>({ url: '/messageNotify/allRead', data })
}

// 单个已读
export const singleReadApi = (data: any) => {
  return request.post<any>({ url: '/messageNotify/singleRead', data })
}

// 获取未读消息数量
export const getNotReadCountApi = () => {
  return request.get<any>({ url: '/messageNotify/getNotReadCount' })
}

// 获取消息列表
export const messagePageListApi = (data: any) => {
  return request.get<any>({ url: '/messageNotify/messagePageList', params: data })
}

// 上下架
export const messageNotifyUpOrDownApi = (data: any) => {
  return request.get<any>({ url: '/messageNotify/messageNotifyUpOrDown', params: data })
}

export const downloadFile = (params: any) => {
  return request.get({ url: '/save/file/downLoadFile', params, responseType: 'blob' })
}
