import axios from '@/libs/api.request'

export const addOrUpdateMenu = (menuTemp) => {
  return axios.request({
    url: '/menu/',
    method: 'post',
    data: menuTemp
  })
}

export const fetchList = () => {
  return axios.request({
    url: '/menu/',
    method: 'get'
  })
}

export const getTreeList = () => {
  return axios.request({
    url: '/menu/tree',
    method: 'get'
  })
}

export const getMenuInfo = (id) => {
  return axios.request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export const deleteMunu = (id) => {
  return axios.request({
    url: '/menu/' + id,
    method: 'delete'
  })
}
