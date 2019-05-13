import axios from '@/libs/api.request'

// 分页获取可申请出库的细胞列表
export const getOutApplyList = (queryList) => {
  return axios.request({
    url: '/outApply/getOutApplyList',
    method: 'get',
    params: queryList
  })
}

// 分页获取出库申请台账的细胞列表
export const getOutApplyBookList = (queryList) => {
  return axios.request({
    url: '/outApply/getOutApplyBookList',
    method: 'get',
    params: queryList
  })
}

// 根据样本id获取样本信息
export const getSampelById = (sampleId) => {
  return axios.request({
    url: '/outApply/getSampelById',
    method: 'get',
    params: { sampleId: sampleId }
  })
}

// 新增出库申请信息
export const addOutApply = (outApplyTemp) => {
  return axios.request({
    url: '/outApply/addOutApply',
    method: 'post',
    data: outApplyTemp
  })
}

// 加载出库申请信息
export const getOutApplyInfo = (cellOutStoreId) => {
  return axios.request({
    url: '/outApply/getOutApplyInfo',
    method: 'get',
    params: { cellOutStoreId: cellOutStoreId }
  })
}

// 编辑出库申请信息
export const updateOutApply = (outApplyTemp) => {
  return axios.request({
    url: '/outApply/updateOutApply',
    method: 'post',
    data: outApplyTemp
  })
}
