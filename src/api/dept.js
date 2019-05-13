import axios from '@/libs/api.request'

/**
 * @param {*} companyId 根据公司Idh获取部门下拉框数据
 */
export const getDepartmentdata = (id) => {
  return axios.request({
    url: 'dept/getDepartmentList',
    method: 'get',
    params: {
      companyId: id
    }
  })
}

export const getDepartmentPageList = (query) => {
  return axios.request({
    url: '/dept/getDepartmentPageList',
    method: 'get',
    params: query
  })
}

