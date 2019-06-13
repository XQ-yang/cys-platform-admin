import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/position/page',
    method: 'get',
    params: query
  })
}
// 根据部门id获取岗位列表
export const getList = (id) => {
  return axios.request({
    url: '/position/positions/' + id,
    method: 'get'
  })
}
export const addOrUpdatePosition = (positionTemp) => {
  return axios.request({
    url: '/position/',
    method: 'post',
    data: positionTemp
  })
}
export const getPosition = (id) => {
  return axios.request({
    url: '/position/' + id,
    method: 'get'
  })
}

export const removePosition = (id) => {
  return axios.request({
    url: '/position/' + id,
    method: 'delete'
  })
}
