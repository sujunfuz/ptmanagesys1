import request from '@/config/axios'

// 当日营收
export const dailyRevenueApi = () => {
  return request.get<any>({ url: '/datacenter/dailyRevenue' })
}

// 商品分析
export const goodsAnalysisApi = (params: any) => {
  return request.get<any>({ url: '/datacenter/goodsAnalysis', params })
}

// 订单分析
export const orderAnalysisApi = (params: any) => {
  return request.get<any>({ url: '/datacenter/orderAnalysis', params })
}
