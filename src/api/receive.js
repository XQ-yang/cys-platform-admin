import axios from '@/libs/api.request'

// 分页获取样品待验收信息
export const getWaitList = (queryList) => {
  return axios.request({
    url: '/receive/getWaitReceivetList',
    method: 'get',
    params: queryList
  })
}

// 分页获取样品验收台账信息
export const getBookList = (queryList) => {
  return axios.request({
    url: '/receive/getReceiveBookList',
    method: 'get',
    params: queryList
  })
}

// 新增样品验收信息
export const addReceive = (receiveTemp) => {
  return axios.request({
    url: '/receive/addReceive',
    method: 'post',
    data: receiveTemp
  })
}

// 根据验收id获取验收信息
export const getReceiveById = (id) => {
  return axios.request({
    url: '/receive/getReceiveById',
    method: 'get',
    params: { id: id }
  })
}

// 根据样本id获取样本信息
export const getSampelById = (sampleId) => {
  return axios.request({
    url: '/receive/getSampelById',
    method: 'get',
    params: { sampleId: sampleId }
  })
}
