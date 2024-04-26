import request from '@/config/axios'

//获取商家入驻表头
export const getAfterSalesTopApi = () => {
  return request.get({ url: '/afSalesRecord/pageTop' })
}

// 获取商家入驻列表
export const getAfterSalesListApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/afSalesRecord/pageList' + str })
  //   return request.get({ url: '/afSalesRecord/pageList', data })
}

//新增售后单

export const addAfSalesRecordApi = (data) => {
  return request.post({
    url: '/afSalesRecord/add',
    data
  })
}

//根据id查询售后单详情
export const getAfSalesById = (data) => {
  return request.get({
    url: '/afSalesRecord/detail?id=' + data.id
  })
}

//同意售后
export const agreeAfSalesRecordApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.post({
    url: '/afSalesRecord/agree' + str
  })
}

//拒绝售后
export const refuseAfSalesRecordApi = (data) => {
  return request.post({
    url: '/afSalesRecord/refuse',
    data
  })
}

//直接退款
export const refundAfSalesRecordApi = (data) => {
  return request.post({
    url: '/afSalesRecord/refund?id=' + data.id
  })
}

// 获取商家退货地址
export const getShopRefundAddr = () => {
  return request.get({ url: '/afSalesRecord/getShopRefundAddr' })
}
