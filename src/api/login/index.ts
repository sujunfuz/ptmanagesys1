import request from '@/config/axios'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: any) => {
  return request.get({ url: '/login/go', params: data })
}

export const getMenuList = () => {
  return request.get({ url: '/login/index ' })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/role/list2', params })
}

export const registerApi = (data: any) => {
  return request.post({ url: '/mer/merintopieces/add', data })
}

export const getVerificationCodeAPi = (params: any) => {
  return request.get({ url: '/mer/merintopieces/verificationCode?applicantMobile=' + params })
}

export const getVerificationCodeAPi1 = (params: any) => {
  return request.get({ url: '/mer/merintopieces/emailVerifyCode?email=' + params })
}

export const registerApi1 = (data: any) => {
  return request.post({ url: '/account/forgetPwd', data })
}
