import axios from '@/libs/api.request'

// 获取角色下拉框数据
export const getRoleData = () => {
  return axios.request({
    url: '/role/getList',
    method: 'get'
  })
}
// 获取角色关联列表分页数据
export const fetchList = (query) => {
  return axios.request({
    url: '/role/getPageList',
    method: 'get',
    params: query
  })
}
// 编辑角色
export const editRole = (userTemp) => {
  return axios.request({
    url: '/role/edit',
    method: 'post',
    data: userTemp
  })
}
// 添加角色
export const addRole = (userTemp) => {
  return axios.request({
    url: '/role/add',
    method: 'post',
    data: userTemp
  })
}
// 删除角色
export const deleteRole = (id) => {
  return axios.request({
    url: 'role/delete',
    method: 'get',
    params: { id }
  })
}

// 获取所有的权限树信息
export const allPermTree = (isMenu) => {
  return axios.request({
    url: 'perm/allPermTree',
    method: 'get',
    params: { isMenu }
  })
}
// 获取当前登录用的权限树信息
export const curUserPermTree = (isMenu) => {
  return axios.request({
    url: 'perm/curUserPermTree',
    method: 'get',
    params: { isMenu }
  })
}
// 根据角色Id获取整个权限树，角色拥有的权限用checked=true 表示
export const rolePermTree = (id) => {
  return axios.request({
    url: 'perm/rolePermTree',
    method: 'get',
    params: { roleId: id }
  })
}
export const updateRolePerm = (permTemp) => {
  return axios.request({
    url: '/perm/updateRolePerm',
    method: 'post',
    data: permTemp
  })
}
