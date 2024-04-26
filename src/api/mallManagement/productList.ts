import request from '@/config/axios'

// 商品列表获取表头
export const getTopApi = () => {
  return request.get<any>({ url: '/ecSpu/pageTop' })
}

// 商品列表分页列表查询
export const getListApi = (params: any) => {
  return request.get<any>({ url: '/ecSpu/pageList', params })
}

// 商品列表通过id查询
export const getQueryByIdApi = (ids: any) => {
  return request.get<any>({ url: `/ecSpu/queryById/${ids}` })
}

// 商品列表添加
export const addApi = (data: any) => {
  return request.post<any>({ url: '/ecSpu/add', data })
}

// 商品列表编辑
export const editApi = (data: any) => {
  return request.put<any>({ url: '/ecSpu/edit', data })
}

// 商品列表删除
export const deleteApi = (data: any) => {
  return request.delete<any>({ url: '/ecSpu/deleteBatchById', data })
}

// 更新上下架状态通过id
export const getUpdateShowStatusByIdApi = (ids: string, showStatus: string) => {
  return request.get<any>({ url: `/ecSpu/updateShowStatusById/${ids}/${showStatus}` })
}

// 导出商品模板EXECL
export const getExportTemplateApi = () => {
  return request.get<any>({ url: '/ecSpu/exportTemplate', responseType: 'blob' })
}

// 导入Execl商品数据
export const importExcelApi = (data: any) => {
  return request.post<any>({ url: '/ecSpu/importExcel', data })
}

// 导入记录分页列表查询
export const excelPageListApi = (data) => {
  return request.get<any>({ url: '/ecSpu/excelPageList', data })
}

// 获取树型结构类目
export const getTreeApi = () => {
  return request.get<any>({ url: '/category/getTree' })
}
// 获取树型结构类目
export const getAllTreeApi = (params) => {
  return request.get<any>({ url: '/category/getTree', params })
}
// 获取属性
export const postAttrApi = (data: any) => {
  return request.post<any>({ url: '/attr/getAttr', data })
}

// 获取全部类目
export const getWholeApi = () => {
  return request.get<any>({ url: '/category/getWhole' })
}

// 通过商户号查询
export const queryByMerchantNoApi = (merchantNo: any) => {
  return request.get<any>({ url: '/ecFreightTemplate/queryByMerchantNo/' + merchantNo })
}

// 更新库存通过id
export const updatedInventoryApi = (id: any, inventory: any) => {
  return request.get<any>({ url: `/ecSku/updateInventoryById/${id}/${inventory}` })
}

// 撤销
export const revokeGoodsAuditRecord = (data) => {
  return request.get({ url: '/ecSpu/revokeGoodsAuditRecord/' + data })
}
