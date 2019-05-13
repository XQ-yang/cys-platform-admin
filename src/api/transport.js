import axios from '@/libs/api.request'

// 分页获取样品待运输信息
export const getWaitList = (queryList) => {
  return axios.request({
    url: '/transport/getWaitTransportList',
    method: 'get',
    params: queryList
  })
}

// 分页获取样品运输台账信息
export const getBookList = (queryList) => {
  return axios.request({
    url: '/transport/getTransportBookList',
    method: 'get',
    params: queryList
  })
}

// 新增样品运输信息
export const addTransport = (transportTemp) => {
  return axios.request({
    url: '/transport/addTransport',
    method: 'post',
    data: transportTemp
  })
}

// 根据运输id获取运输信息
export const getTransportById = (id) => {
  return axios.request({
    url: '/transport/getTransportById',
    method: 'get',
    params: { id: id }
  })
}

// 根据样本id获取样本信息
export const getSampelById = (sampleId) => {
  return axios.request({
    url: '/transport/getSampelById',
    method: 'get',
    params: { sampleId: sampleId }
  })
}
