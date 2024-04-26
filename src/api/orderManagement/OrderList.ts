import request from '@/config/axios'

//获取订单列表表头
export const getOrderTopApi = () => {
  return request.get({ url: '/ordStoreBatchOrder/pageTop' })
}

// 获取商家订单列表
export const getOrderListApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/ordStoreBatchOrder/pageList' + str })
  //   return request.get({ url: '/afSalesRecord/pageList', data })
}

//根据storeBatchNo查询订单
export const getOrderByIdApi = (data) => {
  // return request.get({ url: '/ordStoreBatchOrder/queryByOrderNo?orderNo=' + data })
  return request.get({ url: '/ordStoreBatchOrder/queryById/' + data })
}

//下载拣货单
export const pdfOrderApi = (params) => {
  return request.get({ url: '/ordStoreBatchOrder/pdf', params, responseType: 'blob' })
}

//新增直销订单表头
export const getDirectOrderTopApi = () => {
  return request.get({ url: '/ordStoreBatchOrder/direct/pageTop' })
}
//新增直销订单list查询
export const getDirectOrderListApi = (data) => {
  return request.post({ url: '/ordStoreBatchOrder/direct/spus', data })
}

//下面是售后用的
//获取订单详细商品数据
export const getStoreOrderByOrderNoApi = (id) => {
  return request.get({ url: '/ordStoreBatchOrder/queryByOrderNo?orderNo=' + id })
}

//获取售后记录详情
export const getAfterSalesDetailApi = (data) => {
  return request.get({ url: '/afSalesRecord/queryById?id=' + data.id })
}

//获取拣货单数据
export const getBatchOrderApi = (params) => {
  return request.get({ url: '/ordStoreBatchOrder/createPickList', params })
}

//智能配货
export const intelDistributeAPi = (data) => {
  return request.post({ url: '/ordStoreBatchOrder/direct/autoSel', data })
}

//生成智能配货
export const generateDistributeAPi = (data) => {
  return request.post({ url: '/ordStoreBatchOrder/generateDirectOrd', data })
}

//发货即填写物流单号
export const goSendAPi = (data) => {
  return request.post({ url: '/ordStoreBatchOrder/goSend', data })
}

//已发货去申报
export const goApplyAPi = (data) => {
  return request.post({ url: '/ordStoreBatchOrder/goApply', data })
}

//取消订单
export const cancelOrderApi = (data) => {
  return request.get({ url: '/ordStoreBatchOrder/cancel/' + data })
}

//修改物流单号
export const editFreightApi = (data) => {
  return request.post({ url: '/ordStoreBatchOrder/changeLogisticsInfo', data })
}

//查询物流
export const viewLogisticsInfoApi = (data) => {
  return request.get({ url: '/ordStoreBatchOrder/viewLogisticsInfo/' + data })
}

//获取订单商品信息

export const getOrderGoodsApi = (data) => {
  return request.get({ url: '/ordStoreBatchOrder/getStoreOrdSkuInfo/' + data })
}

//截单
export const cutOrderApi = (data) => {
  return request.post({ url: '/ordStoreBatchOrder/cutOrd', data })
}
