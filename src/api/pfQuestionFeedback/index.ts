import request from '@/config/axios'

// 问题列表
export const pageListApi = (data) => {
  return request.get({ url: '/pfQuestionFeedback/pageListByUser', params: data })
}

// 获取表头
export const pageTopApi = () => {
  return request.get({ url: '/pfQuestionFeedback/pageTop' })
}

// 问题详情
export const questionDetailApi = (data) => {
  return request.get({ url: '/pfQuestionFeedback/questionDetail', params: data })
}

// 右上角问题详情
export const questionDetailByUser = (data) => {
  return request.get({ url: '/pfQuestionFeedback/questionDetailByUser', params: data })
}


// 客服热线
export const getReplyQuestionApi = (data) => {
  return request.get({ url: '/pfQuestionFeedback/replyQuestion', params: data })
}

// 添加问题
export const addQuestionApi = (data) => {
  return request.post({ url: '/pfQuestionFeedback/addQuestion', data })
}

// 认可回复
export const admitReplyApi = (data) => {
  return request.post({ url: '/pfQuestionFeedback/admitReply', data })
}

// 回复反馈
export const postReplyQuestionApi = (data) => {
  return request.post({ url: '/pfQuestionFeedback/replyQuestion', data })
}
