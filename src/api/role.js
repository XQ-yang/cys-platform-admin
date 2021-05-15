import axios from '@/libs/api.request'

/**
 * @param {Object} role
 * @description 角色列表分页查询方法
 */
export const fetchList = (query) => {
  return axios.request({
    url: '/role/get_page',
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
    url: '/role/save',
    method: 'post',
    data: role
  })
}
/**
 * @description 根据id删除角色
 */
export const deleteRole = (id) => {
  return axios.request({
    url: '/role/remove',
    method: 'post',
    data: id
  })
}

export const getRoleInfo = (id) => {
  return axios.request({
    url: '/role/get_info',
    method: 'get',
    params: { id }
  })
}

export const setRoles = (roleMenus) => {
  return axios.request({
    url: '/role/save_role_menu',
    method: 'post',
    data: roleMenus
  })
}

export const getRoleMenuById = (id) => {
  return axios.request({
    url: '/role/get_menus_by_role_id',
    method: 'get',
    params: { roleId: id }
  })
}
