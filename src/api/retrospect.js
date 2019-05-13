import axios from '@/libs/api.request'
// 获取追溯列表
export const getRetrospectList = (query) => {
  return axios.request({
    url: '/retrospect/getRetrospectList',
    method: 'get',
    params: query
  })
}
// 获取存储信息
export const getCellLocationList = (sampleId) => {
  return axios.request({
    url: '/retrospect/getCellLocationList',
    method: 'get',
    params: {
      sampleId
    }
  })
}

// 根据样本id获取运输信息
export const getBySampleId = (sampleId) => {
  return axios.request({
    url: '/retrospect/getBySampleId',
    method: 'get',
    params: {
      sampleId: sampleId
    }
  })
}

// 根据样本id获取接收信息
export const getReciverBySampleId = (sampleId) => {
  return axios.request({
    url: '/retrospect/getReciverBySampleId',
    method: 'get',
    params: {
      sampleId: sampleId
    }
  })
}

// 根据样本id获取培养信息
export const getCellCultureListBySampleId = (sampleId) => {
  return axios.request({
    url: '/retrospect/getCellCultureListBySampleId',
    method: 'get',
    params: {
      sampleId: sampleId
    }
  })
}

// 根据样本id获取质检信息
export const getQualityCheckBysampleId = (sampleId) => {
  return axios.request({
    url: '/retrospect/getQualityCheckBysampleId',
    method: 'get',
    params: {
      sampleId: sampleId
    }
  })
}

// 根据样本id获取存储信息
export const getCellStoreBysampleId = (sampleId) => {
  return axios.request({
    url: '/retrospect/getCellStoreBysampleId',
    method: 'get',
    params: {
      sampleId: sampleId
    }
  })
}

// 根据样本id获取溯源查看相关信息
export const getSampleViewBySampleId = (sampleId) => {
  return axios.request({
    url: '/retrospect/getSampleViewBySampleId',
    method: 'get',
    params: {
      sampleId: sampleId
    }
  })
}

// 根据样本条码获取样本信息
export const getBySampleCode = (sampleCode) => {
  return axios.request({
    url: '/retrospect/getBySampleCode',
    method: 'get',
    params: {
      sampleCode
    }
  })
}

//
export const getHomeInfo = () => {
  return axios.request({
    url: '/retrospect/getHomeInfo',
    method: 'get',
    params: {
    }
  })
}

// 罐统计信息
export const getPotStatsInfo = () => {
  return axios.request({
    url: '/retrospect/getPotStatsInfo',
    method: 'get',
    params: {}
  })
}
// 首页样本项目类型分组统计前六项
export const getSampleGroupSix = (category) => {
  return axios.request({
    url: '/retrospect/getSampleGroupSix',
    method: 'get',
    params: { category }
  })
}

