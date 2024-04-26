import request from '@/config/axios'

// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/safDetectRule/pageTop' })
}

// // 分页列表查询
// export const getPageListApi = (params: any) => {
//   return request.get<any>({ url: '/safDetectRule/pageList', params })
// }

// // 通过id查询
// export const getPageListByIdApi = (id: any) => {
//   return request.get<any>({ url: '/safDetectRule/queryById/' + id })
// }

// // 添加
// export const addDataListApi = (data: any) => {
//   return request.post<any>({ url: '/safDetectRule/add', data })
// }

// // 编辑
// export const editDataListApi = (data: any) => {
//   return request.put<any>({ url: '/safDetectRule/edit', data })
// }

// 通过id批量删除
// export const deleteDataListApi = (data: any) => {
//   return request.delete<any>({ url: '/safDetectRule/deleteBatchById', data })
// }

// 通过id编辑动作
export const postBatchEditApi = (data: any) => {
  return request.post<any>({ url: '/safDetectRule/editActionBatchById', data })
}

// 获取登录注册规则
export const getRegisterLoginRuleApi = () => {
  return request.get<any>({ url: '/safDetectRule/getRegisterLoginRule' })
}

// 获取购买规则
export const getPurchaseRuleApi = () => {
  return request.get<any>({ url: '/safDetectRule/getPurchaseRule' })
}

// 获取商品规则
export const getGoodsRuleApi = () => {
  return request.get<any>({ url: '/safDetectRule/getGoodsRule' })
}

// 获取订单规则
export const getOrderRuleApi = () => {
  return request.get<any>({ url: '/safDetectRule/getOrderRule' })
}

// 获取结算规则
export const getSettleRuleApi = () => {
  return request.get<any>({ url: '/safDetectRule/getSettleRule' })
}
