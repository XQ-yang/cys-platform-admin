import axios from '@/libs/api.request'

// 分页获取出库待签字列表
export const getOutSignatureList = (queryList) => {
  return axios.request({
    url: '/outSignature/getOutSignatureList',
    method: 'get',
    params: queryList
  })
}

// 分页获取签字确认台账列表
export const getOutSignatureBookList = (queryList) => {
  return axios.request({
    url: '/outSignature/getOutSignatureBookList',
    method: 'get',
    params: queryList
  })
}

// 新增签字确认
export const addSignature = (signatureTemp) => {
  return axios.request({
    url: '/outSignature/addSignature',
    method: 'post',
    data: signatureTemp
  })
}

// 加载签字确认查看信息
export const getSignatureViewInfo = (signatureId) => {
  return axios.request({
    url: '/outSignature/getSignatureViewInfo',
    method: 'get',
    params: { signatureId: signatureId }
  })
}
