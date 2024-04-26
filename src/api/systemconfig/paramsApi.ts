import request from '@/config/axios'

interface paginationType {
  [propName: string]: string | number
}
// 获取参数列表
export const getParamListApi = (data: paginationType) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/param/list' + str })
}

// 刷新参数列表缓存
export const refreshParamListApi = () => {
  return request.post({ url: '/param/refresh' })
}
// 添加参数
export const addParamApi = (data) => {
  return request.post({ url: '/param/add', data })
}

// 编辑参数
export const updateParamApi = (data) => {
  return request.post({ url: '/param/update', data })
}
// 删除参数
export const deleteParamApi = (data) => {
  return request.delete({ url: '/param/delete?id=' + data.id })
}

//pageTop
export const getParamPageTop = () => {
  return request.get({ url: '/param/pageTop' })
}
