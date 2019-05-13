import axios from '@/libs/api.request'

// 获取暂存罐列表
export const getTempStorePot = () => {
  return axios.request({
    url: '/box/getTempStorePot',
    method: 'get'
  })
}

// 根据罐样本类型获取存储罐列表, 罐样本类型(1: 阴性, 2: 阳性)
export const getStorePot = (sampleType) => {
  return axios.request({
    url: '/box/getStorePot',
    method: 'get',
    params: { sampleType: sampleType }
  })
}

// 根据罐样本类型获取公关罐列表, 罐样本类型(1: 阴性, 2: 阳性)
export const getPublicStorePot = (sampleType) => {
  return axios.request({
    url: '/box/getPublicStorePot',
    method: 'get',
    params: { sampleType: sampleType }
  })
}

// 根据罐编码获取该罐拥有的分区列表信息
export const getRegionByPotCode = (query) => {
  return axios.request({
    url: '/box/getRegionByPotCode',
    method: 'get',
    params: query
  })
}

// 根据罐id, 区编码获取该区下拥有的塔列表信息
export const getTowerOfRegion = (query) => {
  return axios.request({
    url: '/box/getTowerOfRegion',
    method: 'get',
    params: query
  })
}

// 根据罐id, 区编码, 塔编码, 获取该塔下的所有盒子列表信息
export const getBoxOfTower = (query) => {
  return axios.request({
    url: '/box/getBoxOfTower',
    method: 'get',
    params: query
  })
}

// 根据盒子id, 获取盒子的信息及盒子占用情况
export const getBoxInfo = (query) => {
  return axios.request({
    url: '/box/getBoxInfo',
    method: 'get',
    params: query
  })
}
