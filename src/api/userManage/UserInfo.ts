import request from '@/config/axios'

export const getUserInfoTopApi = () => {
  return request.get({ url: '/userInfo/pageTop' })
}

export const getUserInfoListApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/userInfo/pageList' + str })
  //   return request.get({ url: '/afSalesRecord/pageList', data })
}

// 修改状态
export const editUserStatusListApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/userInfo/editStatus' + str })
  //   return request.get({ url: '/afSalesRecord/pageList', data })
}

// 获取商家信息详情
export const getMerInfoDetailApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/merInfo/merchantDetail' + str })
  //   return request.get({ url: '/afSalesRecord/pageList', data })
}

//获取商家主体资质
export const getMerInfoMainApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/merInfo/getMainBody' + str })
  //   return request.get({ url: '/afSalesRecord/pageList', data })
}

//编辑商家信息
export const editMerInfoApi = (data) => {
  return request.put({
    url: '/merInfo/edit',
    data
  })
}
//新增售后单

export const addAfSalesRecordApi = (data) => {
  return request.post({
    url: '/afSalesRecord/add',
    data
  })
}

//根据id查询售后单
export const getAfSalesById = (data) => {
  return request.get({
    url: '/afSalesRecord/detail?id=' + data.id
  })
}

// 导出
export const exportChooseFile = (data) => {
  return request.post({
    url: '/userInfo/exportUserInfoExcel',
    data,
    responseType: 'blob'
  })
}
