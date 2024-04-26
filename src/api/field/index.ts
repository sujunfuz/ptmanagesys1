import request from '@/config/axios'

export const getFieldApi = (params: any) => {
  return request.get<any>({ url: '/column/list', params })
}

export const deleteFieldApi = (params: any) => {
  return request.get<any>({ url: '/column/delete', params })
}
