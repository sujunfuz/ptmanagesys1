import request from '@/config/axios'

// 获取运费模板列表
export const getFreightListApi = (data: any) => {
  let str: string = '?'
  Object.keys(data).forEach((key) => {
    str += key + '=' + data[key] + '&'
  })
  str = str.substring(0, str.length - 1)
  return request.get({ url: '/ecFreightTemplate/pageList' + str })
}

//通过id查询运费模板
export const getFreightByIdApi = (data: any) => {
  return request.get({ url: '/ecFreightTemplate/queryById/' + data.id })
}

//获取表头
export const getFreightPageTopApi = () => {
  return request.get({ url: '/ecFreightTemplate/pageTop' })
}

//获取全部地区信息
export const getAllAreaApi = () => {
  return request.get({ url: '/sysArea/getAllArea' })
}

//编辑运费模板
export const editFreightTemplateApi = (data: any) => {
  return request.put({ url: '/ecFreightTemplate/edit', data })
}

//添加运费模板
export const addFreightTemplateApi = (data: any) => {
  return request.post({ url: '/ecFreightTemplate/add', data })
}

//删除运费模板
export const deleteFreightByBatchNoApi = (data: any) => {
  return request.delete({ url: '/ecFreightTemplate/deleteBatchByBatchNo', data })
}
