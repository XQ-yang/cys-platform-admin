import axios from '@/libs/api.request'

export const sendAllWebSocket = (query) => {
  return axios.request({
    url: '/websocket/sendAllWebSocket',
    method: 'get',
    params: query
  })
}

export const sendOneWebSocket = (query) => {
  return axios.request({
    url: '/websocket/sendOneWebSocket',
    method: 'get',
    params: query
  })
}
