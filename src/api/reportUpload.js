import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/report/getPageList',
    method: 'get',
    params: query
  })
}

export const addReportFile = (reportFileTemp) => {
  return axios.request({
    url: '/report/add',
    method: 'post',
    data: reportFileTemp
  })
}

export const deleteReportFile = (id) => {
  return axios.request({
    url: '/report/delete',
    method: 'post',
    params: { id }
  })
}

export const getReportList = () => {
  return axios.request({
    url: '/report/getReportCountByQuarter',
    method: 'get'
  })
}
