import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/position/get_page',
    method: 'get',
    params: query
  })
}
// 根据部门id获取岗位列表
export const getList = (id) => {
  return axios.request({
    url: '/position/get_positions_by_dept_id',
    method: 'get',
    params: { deptId: id }
  })
}

export const addOrUpdatePosition = (positionTemp) => {
  return axios.request({
    url: '/position/save',
    method: 'post',
    data: positionTemp
  })
}
export const getPosition = (id) => {
  return axios.request({
    url: '/position/get_info',
    method: 'get',
    params: id
  })
}

export const removePosition = (id) => {
  return axios.request({
    url: '/position/remove',
    method: 'post',
    data: id
  })
}
