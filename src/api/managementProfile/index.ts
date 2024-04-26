import request from '@/config/axios'
//pageTOp
export const getFiPageTop = () => {
  return request.get<any>({ url: '/finSettlement/pageTop' })
}
// 提现
export const settleApi = (data: any) => {
  return request.post<any>({ url: '/finSettlement/settle', data })
}

// 获取验证码
export const getVerifyCodeApi = (params: any) => {
  return request.get<any>({ url: '/finSettlement/getVerifyCode', params })
}

// 马上借款
export const rightLendApi = (data: any) => {
  return request.post<any>({ url: '/finSettlement/preSettle', data })
}

// 立即还款
export const repayApi = (data: any) => {
  return request.post<any>({ url: '/finSettlement/repay', data })
}

// 确认支付
export const confirmPayApi = (data: any) => {
  return request.post<any>({ url: '/finSettlement/confirmPay', data })
}

// 获取收款账户信息
export const getAccountInfoApi = (params) => {
  return request.get<any>({ url: '/finSettlement/getAccountInfo', params })
}

// 确认账户信息
export const confirmAccountInfoApi = (data: any) => {
  return request.post<any>({ url: '/finSettlement/confirmAccountInfo', data })
}

// 确认借款信息
export const confirmBorrowInfoApi = (data: any) => {
  return request.post<any>({ url: '/finSettlement/confirmBorrowInfo', data })
}

// 获取还款信息
export const getRepayInfoApi = () => {
  return request.get<any>({ url: '/finSettlement/getRepayInfo' })
}

// 账户钱款
export const accountApi = () => {
  return request.get<any>({ url: '/businessOverview/account' })
}

// 构成渠道
export const channelApi = () => {
  return request.get<any>({ url: '/businessOverview/channel' })
}

// 授信分析
export const creditApi = () => {
  return request.get<any>({ url: '/businessOverview/credit' })
}

// 交易分析
export const tradeApi = (data: any) => {
  return request.get<any>({ url: '/businessOverview/trade', params: data })
}
