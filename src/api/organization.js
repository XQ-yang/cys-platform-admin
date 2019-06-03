import axios from '@/libs/api.request'

export const addOrUpdateOrg = (dataForm) => {
  return axios.request({
    url: '/org/',
    method: 'post',
    data: dataForm
  })
}

/**
 *获取菜单列表数据
*/
export const fetchList = (query) => {
  return axios.request({
    url: '/org/page/',
    method: 'get',
    params: query
  })
}

export const getOrgInfo = (id) => {
  return axios.request({
    url: '/org/' + id,
    method: 'get'
  })
}

export const deleteOrg = (id) => {
  return axios.request({
    url: '/org/' + id,
    method: 'delete'
  })
}
