import request from '@/config/axios'

// 日志列表
export const logList = (data: Object) => {
  return request.get({ url: '/log/list', params: data })
}

// 删除日志
export const logDelete = (data: any) => {
  return request.delete({ url: '/log/delete', data })
}

// 日志详情
export const logDetail = (data: Object) => {
  return request.get({ url: '/log/detail', params: data })
}

//pageTop
export const getLogPageTop = () => {
  return request.get({ url: '/log/pageTop' })
}
