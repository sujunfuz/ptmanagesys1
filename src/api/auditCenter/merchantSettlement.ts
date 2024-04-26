import request from '@/config/axios'

//获取商家入驻表头
export const getMerchantPageTopApi = () => {
  return request.get({ url: '/mer/audit/pageTop' })
}

// 获取商家入驻列表
export const getMerchantListApi = (data) => {
  return request.post({ url: '/mer/audit/pageList', data })
}

//获取商家入驻详情
export const getMerchantDetailApi = (data) => {
  return request.get({ url: '/mer/audit/view?id=' + data.id })
}

// 商家审核失败
export const auditFailApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/mer/audit/failedAudit' + str })
}

//一审通过
export const passFirstAuditApi = (data) => {
  return request.get({ url: '/mer/audit/passFirstAudit?id=' + data.id })
}

// 二审通过
export const passSecondAuditApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/mer/audit/passSecondAudit' + str })
}

// 二审通过UI
export const passSecondAuditUIApi = (data) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/mer/audit/passSecondAuditUI' + str })
}

// 上传物流
export const uploadLogisticsApi = (params: any) => {
  return request.get({ url: '/mer/merintopieces/uploadLogistics', params })
}

// 上传物流
export const uploadLogisticsApi1 = (params: any) => {
  return request.get({ url: '/mer/audit/bossUploadLogistics', params })
}

// 物流公司枚举
export const getLogisticsEnumApi = () => {
  return request.get({ url: '/mer/merintopieces/getLogisticsEnum' })
}

// 获取商家和店铺物流信息
export const getLogisticsDetailApi = () => {
  return request.get({ url: '/mer/merintopieces/getLogisticsDetail' })
}

// 下载
export const getContractTemplateApi = () => {
  return request.get<any>({
    url: '/mer/merintopieces/getContractTemplate'
  })
}

// 上传物流
export const bossUploadLogisticsApi = (params: any) => {
  return request.get({ url: '/mer/audit/bossUploadLogistics', params })
}
