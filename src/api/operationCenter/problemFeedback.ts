import request from '@/config/axios'
// 获取表头
export const getPageTopApi = () => {
  return request.get<any>({ url: '/pfQuestionFeedback/questionFeedbackPageTop' })
}

// 列表
export const getPageListApi = (params: any) => {
  return request.get<any>({ url: '/pfQuestionFeedback/pageList', params })
}
