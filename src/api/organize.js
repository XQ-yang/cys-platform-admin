import axios from '@/libs/api.request'

/**
 * 获取公司下拉数据
 */
export const getCompanyList = () => {
  return axios.request({
    url: '/dept/getCompanyList',
    method: 'get'
  })
}
// 获取公司列表分页方法
export const getCompanyPageList = (query) => {
  return axios.request({
    url: '/dept/getCompanyPageList',
    method: 'get',
    params: query
  })
}

// 编辑角色
export const editCompany = (userTemp) => {
  return axios.request({
    url: '/dept/edit',
    method: 'post',
    data: userTemp
  })
}
// 添加角色
export const addCompany = (userTemp) => {
  return axios.request({
    url: '/dept/add',
    method: 'post',
    data: userTemp
  })
}
// 删除角色
export const deleteCompany = (id) => {
  return axios.request({
    url: 'dept/delete',
    method: 'get',
    params: { id }
  })
}
