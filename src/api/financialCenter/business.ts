import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/merAccount/pageTop' })
}

// 分页列表查询
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/merAccount/pageList', params })
}

// 确认金额
export const getCheckAuthAmountApi = (data: any) => {
  return request.get<any>({ url: '/merAccount/checkAuthAmount', params: data })
}

// 效验认证信息
export const checkAuthInfoApi = (params: any) => {
  return request.get<any>({ url: '/merAccount/checkAuthInfo', params })
}

// 校验商家资金账户状态
export const checkMerAccountStatusApi = () => {
  return request.get<any>({ url: '/merAccount/checkMerAccountStatus' })
}

// 获取付款方信息
export const getPaySideInfoApi = () => {
  return request.get<any>({ url: '/merAccount/getPaySideInfo' })
}
