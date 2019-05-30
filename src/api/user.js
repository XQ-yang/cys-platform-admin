import axios from '@/libs/api.request'
import qs from 'qs'
export const login = ({ userName, password }) => {
  let grant_type = 'password'
  let client_id = 'admin-web'
  let client_secret = '4402b06a67334d769fed712453284dae'
  const data = {
    username: userName,
    password: password,
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret
  }
  return axios.request({
    url: '/oauth/token',
    data: qs.stringify(data),
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/user/current',
    method: 'get'
  })
}
export const logout = () => {
  return axios.request({
    url: '/api/revokeToken',
    method: 'post'
  })
}

export const fetchList = (query) => {
  return axios.request({
    url: '/user/getPageList',
    method: 'get',
    params: query
  })
}

export const editUser = (userTemp) => {
  return axios.request({
    url: '/user/edit',
    method: 'post',
    data: userTemp
  })
}

export const addUser = (userTemp) => {
  return axios.request({
    url: '/user/add',
    method: 'post',
    data: userTemp
  })
}

export const deleteUser = (id) => {
  return axios.request({
    url: 'user/delete',
    method: 'get',
    params: { id }
  })
}

// 获取所有用户
export const getUserList = () => {
  return axios.request({
    url: '/user/getUserList',
    method: 'get'
  })
}
// 获取登陆用户所拥有的权限
export const authorization = () => {
  return axios.request({
    url: '/perm/curUserPerm',
    method: 'get'
  })
}

export const importUserData = (userImport) => {
  return axios.request({
    url: '/user/importData',
    method: 'post',
    data: userImport
  })
}
export const editPassword = (editPasswordForm) => {
  return axios.request({
    url: '/user/editPassword',
    method: 'post',
    data: editPasswordForm
  })
}

// 获取角色为“质检”的用户
export const getQualityUserList = () => {
  return axios.request({
    url: '/user/getQualityUserList',
    method: 'get'
  })
}
