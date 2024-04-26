import request from '@/config/axios'

// 公司信息详情
export const getcompanyDetailApi = () => {
  return request.get<any>({ url: 'merchant/companyDetail' })
}

// 公司编辑
export const editCompanyApi = (data: any) => {
  return request.post<any>({ url: '/merchant/editCompany', data })
}

// 公司表头
export const getTopApi = () => {
  return request.get<any>({ url: '/merchant/pageTop' })
}

// 根据营业执照号回填信息
export const getMerDetailByLicenseNoApi = (params: any) => {
  return request.get<any>({ url: '/merchant/getMerDetailByLicenseNo', params })
}

// 主体制资质
export const getMainBodyApi = (params: any) => {
  return request.get<any>({ url: '/merchant/getMainBody', params })
}

// 证件有效期更新
export const updateBusinessTermApi = (params: any) => {
  return request.get<any>({ url: '/merchant/updateBusinessTerm', params })
}
