import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/distributor/getPageList',
    method: 'get',
    params: query
  })
}

export const addDistributor = (distributorTemp) => {
  return axios.request({
    url: '/distributor/add',
    method: 'post',
    data: distributorTemp
  })
}

export const editDistributor = (distributorTemp) => {
  return axios.request({
    url: '/distributor/edit',
    method: 'post',
    data: distributorTemp
  })
}

export const deleteDistributor = (id) => {
  return axios.request({
    url: 'distributor/delete',
    method: 'get',
    params: { id }
  })
}

// 获取所有的渠道
export const getAllDistributor = () => {
  return axios.request({
    url: 'distributor/getAllDistributor',
    method: 'get'
  })
}
