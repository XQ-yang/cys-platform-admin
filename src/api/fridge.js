import axios from '@/libs/api.request'

export const getFridgePage = (query) => {
  return axios.request({
    url: '/fridge/getPageList',
    method: 'get',
    params: query
  })
}

export const getCurrentFridgeCode = () => {
  return axios.request({
    url: '/fridge/getCurrentFridgeCode',
    method: 'get'
  })
}

export const addFridge = (fridgTemp) => {
  return axios.request({
    url: '/fridge/addFridge',
    method: 'post',
    data: fridgTemp
  })
}

export const deleteFridge = (params) => {
  return axios.request({
    url: '/fridge/deleteById',
    method: 'get',
    params: params
  })
}

// 配置获取列表数据
export const getFridgeData = (params) => {
  return axios.request({
    url: '/fridge/getFridgeData',
    method: 'get',
    params: params
  })
}

export const getCurrentLayerCode = (params) => {
  return axios.request({
    url: '/fridge/getCurrentLayerCode',
    method: 'get',
    params: params
  })
}

export const addLayer = (entityTemp) => {
  return axios.request({
    url: '/fridge/addLayer',
    method: 'post',
    data: entityTemp
  })
}

export const getLayerInfo = (params) => {
  return axios.request({
    url: '/fridge/getLayerInfo',
    method: 'get',
    params: params
  })
}
export const updateLayer = (entityTemp) => {
  return axios.request({
    url: '/fridge/updateLayer',
    method: 'post',
    data: entityTemp
  })
}

export const deleteLayerByCode = (params) => {
  return axios.request({
    url: '/fridge/deleteLayer',
    method: 'get',
    params: params
  })
}
//
export const getCurrentRackCode = (params) => {
  return axios.request({
    url: '/fridge/getCurrentRackCode',
    method: 'get',
    params: params
  })
}

export const addRack = (entityTemp) => {
  return axios.request({
    url: '/fridge/addRack',
    method: 'post',
    data: entityTemp
  })
}

export const getRackInfo = (params) => {
  return axios.request({
    url: '/fridge/getRackInfo',
    method: 'get',
    params: params
  })
}
export const updateRack = (entityTemp) => {
  return axios.request({
    url: '/fridge/updateRack',
    method: 'post',
    data: entityTemp
  })
}

export const deleteRackByCode = (params) => {
  return axios.request({
    url: '/fridge/deleteRackInfo',
    method: 'get',
    params: params
  })
}
