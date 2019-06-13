import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/dept/list',
    method: 'get',
    params: query
  })
}

export const addOrUpdateDept = (detpTemp) => {
  return axios.request({
    url: '/dept/',
    method: 'post',
    data: detpTemp
  })
}

export const getDeptInfo = (id) => {
  return axios.request({
    url: '/dept/' + id,
    method: 'get'
  })
}
export const deleteDept = (id) => {
  return axios.request({
    url: '/dept/' + id,
    method: 'delete'
  })
}
