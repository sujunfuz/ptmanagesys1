import request from '@/config/axios'

export const getUserByIdApi = (params: any) => {
  return request.get<any>({ url: '/pms/operator/pageList', params })
}

export const getUserPageTop = () => {
  return request.get<any>({ url: '/pms/operator/pageTop' })
}

export const addOperator = (data: any) => {
  return request.post<any>({ url: '/pms/operator/add', data })
}

export const addOperatorUI = () => {
  return request.get<any>({ url: '/pms/operator/addUI' })
}

export const editOperatorUI = (params: any) => {
  return request.get<any>({ url: '/pms/operator/editUI', params })
}

export const editOperatorById = (data: any) => {
  return request.post<any>({ url: '/pms/operator/edit', data })
}

export const changeStatus = (params: any) => {
  return request.get<any>({ url: '/pms/operator/changeAllStatus', params })
}

export const deleteOperatorById = (params: any) => {
  return request.delete<any>({ url: '/pms/operator/delete/' + params.id })
}

export const resetOperatorPwd = (data: any) => {
  return request.post<any>({ url: '/pms/operator/resetPwd', data })
}

// 获取字段分配列表
export const getOperatorMenuListApi = (data: any) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/pms/operator/operatorMenuList' + str })
}
//获取字段分配UI静态数据
export const getOperatorMenuColumnUIApi = (data: { operatorId: string; menuId: string }) => {
  return request.get({
    url: `/pms/operator/getMenuColumnUI?operatorId=${data.operatorId}&menuId=${data.menuId}`
  })
}
//保存字段分配的更改
export const saveOperatorMenuColumnApi = (data: any) => {
  return request.post({ url: '/pms/operator/operatorSaveColumn', data })
}
