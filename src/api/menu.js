import axios from '@/libs/api.request'

export const addOrUpdateMenu = (menuTemp) => {
  return axios.request({
    url: '/menu/',
    method: 'post',
    data: menuTemp
  })
}

/**
 *获取菜单列表数据
*/
export const fetchList = () => {
  return axios.request({
    url: '/menu/list',
    method: 'get'
  })
}

export const getTreeList = (type) => {
  return axios.request({
    url: '/menu/',
    method: 'get',
    params: { type: type }
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
