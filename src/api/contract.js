import axios from '@/libs/api.request'

// 分页获取合同信息
export const getContractList = (params) => {
  return axios.request({
    url: '/contract/getPageList',
    method: 'get',
    params: params
  })
}

// 添加合同信息
export const addContract = (contractTemp) => {
  return axios.request({
    url: '/contract/saveContract',
    method: 'post',
    data: contractTemp
  })
}
// 根据合同id获取查看信息
export const getContractView = (contractId) => {
  return axios.request({
    url: '/contract/getContractView',
    method: 'get',
    params: { contractId }
  })
}
// 是否存在编码，是返回true
export const isExistContractCode = (contractCode) => {
  return axios.request({
    url: '/contract/isExistContractCode',
    method: 'get',
    params: {
      contractCode
    }
  })
}
// 根据合同id获取编辑信息
export const getEditData = (contractId) => {
  return axios.request({
    url: '/contract/getEditData',
    method: 'get',
    params: {
      contractId
    }
  })
}
// 根据合同id删除合同
export const deleteByContractId = (contractId) => {
  return axios.request({
    url: '/contract/deleteByContractId',
    method: 'get',
    params: {
      contractId
    }
  })
}

