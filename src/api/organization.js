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
    url: '/org/getOrgTree',
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
/**
 * 根据组织id获取部门
 */
export const getDeptsByOrgId = (id) => {
  return axios.request({
    url: '/org/' + id + '/depts',
    method: 'get'
  })
}
