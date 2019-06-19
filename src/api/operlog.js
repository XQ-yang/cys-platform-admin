import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/oper_log/get_page',
    method: 'get',
    params: query
  })
}

export const exportOperlog = (query) => {
  return axios.request({
    url: '/oper_log/get_list',
    method: 'get',
    params: query
  })
}
