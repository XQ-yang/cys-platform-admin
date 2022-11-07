import axios from '@/libs/api.request'
import qs from 'qs'

export const login = ({ username, password, generateKey, captchaCode }) => {
  let grant_type = 'password'
  let client_id = 'admin-web'
  let client_secret = '4402b06a67334d769fed712453284dae'
  let auth_type = 'admin-web'
  const data = {
    username: username,
    password: password,
    generate_key: generateKey,
    captcha_code: captchaCode,
    grant_type: grant_type,
    auth_type: auth_type,
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
    url: '/login/revoke_token',
    method: 'post'
  })
}

export const fetchList = (query) => {
  return axios.request({
    url: '/user/get_page',
    method: 'get',
    params: query
  })
}

export const addOrUpdateUser = (userTemp) => {
  return axios.request({
    url: '/user/save',
    method: 'post',
    data: userTemp
  })
}

export const deleteUser = (id) => {
  return axios.request({
    url: '/user/remove',
    method: 'post',
    data: id
  })
}
export const getUser = (id) => {
  return axios.request({
    url: '/user/get_info',
    method: 'get',
    params: { id }
  })
}

// 获取登陆用户所拥有的权限
export const authorization = () => {
  return axios.request({
    url: '/user/current',
    method: 'get'
  })
}

export const editPassword = (editPasswordForm) => {
  return axios.request({
    url: '/user/edit_password',
    method: 'post',
    data: editPasswordForm
  })
}
export const resetPassword = (id) => {
  return axios.request({
    url: '/user/reset_password',
    method: 'post',
    data: id
  })
}
export const exportData = (query) => {
  return axios.request({
    url: '/user/export_excel',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

export const downloadTemplate = () => {
  return axios.request({
    url: '/user/download_template',
    method: 'get'
  })
}

export const exportWord = (query) => {
  return axios.request({
    url: '/export/export_word',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

export const exportPdf = (query) => {
  return axios.request({
    url: '/export/export_pdf',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
