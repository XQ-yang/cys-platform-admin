import axios from '@/libs/api.request'

export const addOrUpdateOrg = (dataForm) => {
  return axios.request({
    url: '/org/save',
    method: 'post',
    data: dataForm
  })
}

/**
 *获取菜单列表数据
*/
export const fetchList = (query) => {
  return axios.request({
    url: '/org/get_org_tree',
    method: 'get',
    params: query
  })
}

export const getOrgInfo = (id) => {
  return axios.request({
    url: '/org/get_info',
    method: 'get',
    params: { id }
  })
}

export const deleteOrg = (id) => {
  return axios.request({
    url: '/org/remove',
    method: 'post',
    data: id
  })
}
/**
 * 根据组织id获取部门
 */
export const getDeptsByOrgId = (orgId) => {
  return axios.request({
    url: '/dept/deptSelectList',
    method: 'get',
    params: { orgId }
  })
}
