import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/position/page',
    method: 'get',
    params: query
  })
}
export const getList = (query) => {
  return axios.request({
    url: '/position/getPositionListByDeptId',
    method: 'get',
    params: query
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
