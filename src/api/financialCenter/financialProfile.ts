import request from '@/config/axios'

// 渠道构成
export const channelCompositionApi = () => {
  return request.get<any>({ url: '/finOverview/channelComposition' })
}

// 授信分析
export const creditAnalysisApi = () => {
  return request.get<any>({ url: '/finOverview/creditAnalysis' })
}

// 平台钱款
export const platformAmountApi = () => {
  return request.get<any>({ url: '/finOverview/platformAmount' })
}

// 利润分析
export const profitAnalysisApi = (params: any) => {
  return request.get<any>({ url: '/finOverview/profitAnalysis', params })
}

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/finOverview/pageTop' })
}

// 获取货币规则列表
export const getCurrencyRuleListApi = () => {
  return request.get<any>({ url: '/rpCurrencyRule/getCurrencyRuleList' })
}
