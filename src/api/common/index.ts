import request from '@/config/axios'
import qs from 'qs'
//删除图片 林青沐
export const deleteImgApi = (data: { address: string }) => {
  return request.post({
    url: '/file/delAddress',
    data: qs.stringify(data),
    headersType: 'application/x-www-form-urlencoded;charset=UTF-8'
  })
}

// 获取所有字典
export const getDictApi = () => {
  return request.get({ url: '/dict/list' })
}

// 模拟获取某个字典
export const getDictOneApi = async () => {
  return request.get({ url: '/dict/one' })
}

// 获取数据
export const getTestData = async (): Promise<IResponse> => {
  return request.get({ url: '/client/task/conf' })
}

// get带参
export const getDemoTotalReward = async (id: String, data: Object): Promise<IResponse> => {
  return request.get({ url: `/client/task/${id}/totalReward`, data })
}

// get带参
export const getDemo = async (id: String, data: Object): Promise<IResponse> => {
  return request.get({ url: `/client/task/${id}`, data })
}

// all带参
export const getAllDemo = async (data: Object): Promise<IResponse> => {
  return request.get({ url: '/dict/all', data })
}

// post
export const postDemo = (data: Object): Promise<IResponse> => {
  return request.post({ url: '/client/tag', data })
}

//delete
export const deleteDemo = (id: string): Promise<IResponse> => {
  return request.delete({ url: `/client/tag/${id}` })
}

//delete
export const putDemo = (): Promise<IResponse> => {
  return request.put({ url: `/client/messageCenter/sysNotice/readAll` })
}

//获取字段筛选有哪些字段
export const getSortColumnUIApi = (data) => {
  return request.get({ url: data.url })
}
// '/pms/operator/operatorSortColumnUI?menuId=9'
//上传排序的字段
export const sortColumnApi = (data: any) => {
  return request.post({ url: data.url, data })
}
// '/pms/operator/operatorSortColumn'
