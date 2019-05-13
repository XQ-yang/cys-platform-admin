import axios from '@/libs/api.request'
// 分页获取列表
export const getPageList = (query) => {
  return axios.request({
    url: '/hospital/getPageList',
    method: 'get',
    params: query
  })
}
// 添加医院
export const addHospital = (hospitalTemp) => {
  return axios.request({
    url: '/hospital/addHospital',
    method: 'post',
    data: hospitalTemp
  })
}
// 编辑医院
export const editHospital = (hospitalTemp) => {
  return axios.request({
    url: '/hospital/editHospital',
    method: 'post',
    data: hospitalTemp
  })
}
// 删除医院，判断医院名称是否使用，参数id、医院名称
export const deleteHospital = (params) => {
  return axios.request({
    url: '/hospital/deleteHospital',
    method: 'get',
    params: params
  })
}
// 医院名称是否存在
export const existName = (params) => {
  return axios.request({
    url: '/hospital/existName',
    method: 'get',
    params: params
  })
}
// 获取所有的采集医院
export const getAllHospital = () => {
  return axios.request({
    url: 'hospital/getAllHospital',
    method: 'get'
  })
}
