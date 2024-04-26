import request from '@/config/axios'

// 获取字典列表数据
export const getDictListApi = (params: any) => {
  return request.get<any>({ url: '/dict/list', params })
}

export const addDictListApi = (data: any) => {
  return request.post<any>({ url: '/dict/add', data })
}

export const updateDictListApi = (data: any) => {
  return request.post<any>({ url: '/dict/update', data })
}

export const deleteDictListApi = (params: any) => {
  return request.delete<any>({ url: '/dict/delete', params: { id: params[0] } })
}

export const getListItemApi = (params: any) => {
  return request.get<any>({ url: '/dict/listItem', params })
}

export const addDictItemApi = (data: any) => {
  return request.post<any>({ url: '/dict/addItem', data })
}

export const deleteDictItemApi = (params: any) => {
  return request.delete<any>({ url: '/dict/deleteItem', params: { id: params[0] } })
}

export const editDictItemApi = (data: any) => {
  return request.post<any>({ url: '/dict/updateItem', data })
}
//pageTop
export const getDictPageTop = () => {
  return request.get({ url: '/dict/pageTop' })
}
