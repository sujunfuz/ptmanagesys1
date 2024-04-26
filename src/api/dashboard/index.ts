import request from '@/config/axios'

// 企业认证UI
export const companyCertifyUI = () => {
  return request.get({ url: '/mer/merintopieces/companyCertifyUI' })
}

// 企业认证
export const companyCertify = (data: any) => {
  return request.post({ url: '/mer/merintopieces/companyCertify', data })
}

// 商家获取进件状态
export const checkAuditStatus = () => {
  return request.get({ url: '/mer/merintopieces/checkAuditStatus' })
}

// 手机号获取验证码
export const verificationCode = (data: any) => {
  return request.get({ url: '/mer/merintopieces/verificationCode', params: data })
}

// 邮箱获取验证码
export const emailVerifyCode = (data: any) => {
  return request.get({ url: '/mer/merintopieces/emailVerifyCode', params: data })
}

// 根据营业执照号回填信息
export const getMerDetailByLicenseNo = (data: any) => {
  return request.get({ url: '/merchant/getMerDetailByLicenseNo', params: data })
}
