import axios from '@/libs/api.request'

export const getEchartsCardData = () => {
  return axios.request({
    url: '/equipment/cardData',
    method: 'get'
  })
}

export const getEchartsData = () => {
  return axios.request({
    url: '/equipment/echartsData',
    method: 'get'
  })
}
