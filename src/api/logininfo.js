import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/loginInfo/get_page',
    method: 'get',
    params: query
  })
}

