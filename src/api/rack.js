import axios from '@/libs/api.request'

// 获取所有冰箱列表
export const getFridgeList = () => {
  return axios.request({
    url: '/rack/getFridgeList',
    method: 'get'
  })
}

// 根据冰箱编号获取该冰箱拥有的层列表信息
export const getLayerByFridgeCode = (query) => {
  return axios.request({
    url: '/rack/getLayerByFridgeCode',
    method: 'get',
    params: query
  })
}

// 根据冰箱编号, 层编号获取该冰箱该层下拥有的试管架列表信息
export const getRackOfLayer = (query) => {
  return axios.request({
    url: '/rack/getRackOfLayer',
    method: 'get',
    params: query
  })
}

// 根据试管架编码, 获取试管架的信息及试管架位置占用情况
export const getRackInfo = (query) => {
  return axios.request({
    url: '/rack/getRackInfo',
    method: 'get',
    params: query
  })
}
