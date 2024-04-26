import request from '@/config/axios'

//获取商家入驻表头
export const getMerInfoTopApi = () => {
  return request.get({ url: '/merInfo/pageTop' })
}

// 获取商家入驻列表
export const getMerInfoListApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/merInfo/pageList' + str })
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
    url: '/merInfo/exportMerInfoExcel',
    data,
    responseType: 'blob'
  })
}

// 催更
export const addQualificationReminderMessageApi = (params: any) => {
  return request.get({ url: '/merInfo/addQualificationReminderMessage', params })
}
