import axios from '@/libs/api.request'

// 分页获取顾客信息
export const fetchList = (queryList) => {
  return axios.request({
    url: '/customer/getPageList',
    method: 'get',
    params: queryList
  })
}

// 修改顾客信息
export const editCustomer = (customerTemp) => {
  return axios.request({
    url: '/customer/editCustomer',
    method: 'post',
    data: customerTemp
  })
}

// 新增顾客信息
export const addCustomer = (customerTemp) => {
  return axios.request({
    url: '/customer/addCustomer',
    method: 'post',
    data: customerTemp
  })
}

// 根据顾客id获取顾客信息
export const getCustomerById = (id) => {
  return axios.request({
    url: '/customer/getById',
    method: 'get',
    params: { id: id }
  })
}

// 根据顾客姓名和手机号获取顾客信息
export const getCustomerByNameAndPhone = (name, phone) => {
  return axios.request({
    url: '/customer/getCustomerByNameAndPhone',
    method: 'get',
    params: { name: name, phone: phone }
  })
}
// 导入顾客信息
export const importCustomer = (customerImport) => {
  return axios.request({
    url: '/customer/importCustomer',
    method: 'post',
    data: customerImport
  })
}

// 根据顾客id加载顾客相关信息
export const getInfoByCustomerId = (customerId) => {
  return axios.request({
    url: '/customer/getInfoByCustomerId',
    method: 'get',
    params: { customerId: customerId }
  })
}
