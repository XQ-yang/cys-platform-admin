import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/storeapply/getPageList',
    method: 'get',
    params: query
  })
}

export const addStoreApply = (storeApplyTemp) => {
  return axios.request({
    url: '/storeapply/add',
    method: 'post',
    data: storeApplyTemp
  })
}
export const deleteStoreApply = (id) => {
  return axios.request({
    url: '/storeapply/delete',
    method: 'post',
    params: { id }
  })
}
export const editStoreApply = (storeProductTemp) => {
  return axios.request({
    url: '/storeapply/edit',
    method: 'post',
    data: storeProductTemp
  })
}
export const getStoreProduct = (query) => {
  return axios.request({
    url: '/storeproduct/getStoreProduct',
    method: 'get',
    params: query
  })
}

export const getCustomerBySampleCode = (sampleCode) => {
  return axios.request({
    url: '/storeapply/getCustomerBySampleCode',
    method: 'get',
    params: { sampleCode }
  })
}

export const getStoreApplyById = (id) => {
  return axios.request({
    url: '/storeapply/getStoreApplyDetailById',
    method: 'post',
    params: { id }
  })
}
