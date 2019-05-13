import axios from '@/libs/api.request'

// 分页获取待出库信息
export const getWaitOutList = (queryList) => {
  return axios.request({
    url: '/outstorage/getWaitOutList',
    method: 'get',
    params: queryList
  })
}
// 分页获取待审核信息
export const getWaitReviewList = (queryList) => {
  return axios.request({
    url: '/outstorage/getWaitReviewList',
    method: 'get',
    params: queryList
  })
}
// 分页获取待签字信息
export const getWaitSignatureList = (queryList) => {
  return axios.request({
    url: '/outstorage/getWaitSignatureList',
    method: 'get',
    params: queryList
  })
}
// 分页获取细胞出库台账信息
export const getBookList = (queryList) => {
  return axios.request({
    url: '/outstorage/getOutstorageBookList',
    method: 'get',
    params: queryList
  })
}
// 新增出库信息
export const addOutStore = (outStoreTemp) => {
  return axios.request({
    url: '/outstorage/addOutStore',
    method: 'post',
    data: outStoreTemp
  })
}
// 根据样本id获取样本信息
export const getSampelById = (sampleId) => {
  return axios.request({
    url: '/outstorage/getSampelById',
    method: 'get',
    params: { sampleId: sampleId }
  })
}
// 根据样本id获取细胞信息及存储信息
export const getCellLocationList = (sampleId) => {
  return axios.request({
    url: '/outstorage/getCellLocationList',
    method: 'get',
    params: { sampleId }
  })
}
// 加载出库信息
export const getOutStoreInfo = (cellOutStoreId) => {
  return axios.request({
    url: '/outstorage/getOutStoreInfo',
    method: 'get',
    params: { cellOutStoreId: cellOutStoreId }
  })
}
// 加载已出库的细胞位置信息
export const getOutCellLocationList = (cellOutStoreId) => {
  return axios.request({
    url: '/outstorage/getOutCellLocationList',
    method: 'get',
    params: { cellOutStoreId }
  })
}
// 编辑出库信息
export const updateOutStore = (outStoreTemp) => {
  return axios.request({
    url: '/outstorage/updateOutStore',
    method: 'post',
    data: outStoreTemp
  })
}
// 审核出库信息
export const addReview = (reviewTemp) => {
  return axios.request({
    url: '/outstorage/addReview',
    method: 'post',
    data: reviewTemp
  })
}

// 新增顾客签字确认
export const addSignature = (signatureTemp) => {
  return axios.request({
    url: '/outstorage/addSignature',
    method: 'post',
    data: signatureTemp
  })
}

