import axios from '@/libs/api.request'

export const getPotStatsData = (query) => {
  return axios.request({
    url: '/pot/getPotStatsData',
    method: 'get',
    params: query
  })
}

export const getScheduleData = (params) => {
  return axios.request({
    url: '/pot/getScheduleData',
    method: 'get',
    params: params
  })
}
// 根据罐id、分区编码获取一览数据
export const getScheduleRegionData = (params) => {
  return axios.request({
    url: '/pot/getScheduleRegionData',
    method: 'get',
    params: params
  })
}

export const getLatticeDataByBoxId = (params) => {
  return axios.request({
    url: '/pot/getLatticeDataByBoxId',
    method: 'get',
    params: params
  })
}
