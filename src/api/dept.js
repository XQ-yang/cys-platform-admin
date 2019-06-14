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
    url: '/dept/save',
    method: 'post',
    data: detpTemp
  })
}

export const getDeptInfo = (id) => {
  return axios.request({
    url: '/dept/get_info',
    method: 'get',
    params: id
  })
}
export const deleteDept = (id) => {
  return axios.request({
    url: '/dept/remove',
    method: 'delete',
    data: id
  })
}

