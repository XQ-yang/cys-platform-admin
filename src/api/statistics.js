import axios from '@/libs/api.request'
// 样本交接记录
export const getSampleHandoverList = (query) => {
  return axios.request({
    url: '/statistics/getSampleHandoverList',
    method: 'get',
    params: query
  })
}
// 细胞暂存
export const getCellTempStoreList = (query) => {
  return axios.request({
    url: '/statistics/getCellTempStoreList',
    method: 'get',
    params: query
  })
}
// 细胞存储
export const getCellStoreList = (query) => {
  return axios.request({
    url: '/statistics/getCellStoreList',
    method: 'get',
    params: query
  })
}

export const getHalfYearParams = () => {
  return axios.request({
    url: '/statistics/getHalfYearParams',
    method: 'get'
  })
}

