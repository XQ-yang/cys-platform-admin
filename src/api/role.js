import axios from '@/libs/api.request'

/**
 * @param {Object} role
 * @description 角色列表分页查询方法
 */
export const fetchList = (query) => {
  return axios.request({
    url: '/role/page',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} role
 * @description 角色新增编辑方法
 */
export const addOrUpdateRole = (role) => {
  return axios.request({
    url: '/role/',
    method: 'post',
    data: role
  })
}
/**
 * @description 根据id删除角色
 */
export const deleteRole = (id) => {
  return axios.request({
    url: '/role/' + id,
    method: 'delete'
  })
}

export const getRoleInfo = (id) => {
  return axios.request({
    url: '/role/' + id,
    method: 'get'
  })
}

export const setRoles = (roleMenus) => {
  console.log(roleMenus)
  return axios.request({
    url: '/role/roleMenu',
    method: 'post',
    data: roleMenus
  })
}

export const getRoleMenuById = (id) => {
  return axios.request({
    url: '/role/roleMenu/' + id,
    method: 'get'
  })
}

export const getRoleDeptById = (id) => {
  return axios.request({
    url: '/role/roleDept/' + id,
    method: 'get'
  })
}
export const setDeptRoles = (deptRoles) => {
  return axios.request({
    url: '/role/roleDept',
    method: 'post',
    data: deptRoles
  })
}
