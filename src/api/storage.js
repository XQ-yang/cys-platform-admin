import axios from '@/libs/api.request'

export const getPotInfo = (query) => {
  return axios.request({
    url: '/pot/getPageList',
    method: 'get',
    params: query
  })
}

export const addPot = (potTemp) => {
  return axios.request({
    url: '/pot/add',
    method: 'post',
    data: potTemp
  })
}

export const hasPotCode = (potCode) => {
  return axios.request({
    url: '/pot/hasPotCode',
    method: 'get',
    params: potCode
  })
}
// 配置获取列表数据
export const getPotData = (potParams) => {
  return axios.request({
    url: '/pot/getPotData',
    method: 'get',
    params: potParams
  })
}

// 获取当前液态罐编码
export const getCurrentPotCode = () => {
  return axios.request({
    url: '/pot/getCurrentPotCode',
    method: 'get'
  })
}
// 根据id删除罐
export const deleteByPotId = (potId) => {
  return axios.request({
    url: '/pot/deleteByPotId',
    method: 'get',
    params: potId
  })
}

// 根据罐id获取当前分区编码
export const getCurrentRegionCode = (potId) => {
  return axios.request({
    url: '/pot/getCurrentRegionCode',
    method: 'get',
    params: potId
  })
}

// 根据罐id，分区编码获取当前塔编码
export const getCurrentTowerCode = (params) => {
  return axios.request({
    url: '/pot/getCurrentTowerCode',
    method: 'get',
    params: params
  })
}

// 分区添加
export const addRegion = (entityTemp) => {
  return axios.request({
    url: '/pot/addRegion',
    method: 'post',
    data: entityTemp
  })
}

// 根据罐id分区编码获取现有分区数据
export const getRegionInfo = (params) => {
  return axios.request({
    url: '/pot/getRegionInfo',
    method: 'get',
    params: params
  })
}

// 分区编辑
export const updateRegion = (entityTemp) => {
  return axios.request({
    url: '/pot/updateRegion',
    method: 'post',
    data: entityTemp
  })
}

// 根据id，分区编码删除分区
export const deleteRegion = (params) => {
  return axios.request({
    url: '/pot/deleteRegion',
    method: 'get',
    params: params
  })
}

// 分区塔
export const addTower = (entityTemp) => {
  return axios.request({
    url: '/pot/addTower',
    method: 'post',
    data: entityTemp
  })
}

// 根据罐id分区编码塔编码获取现有塔数据
export const getTowerInfo = (params) => {
  return axios.request({
    url: '/pot/getTowerInfo',
    method: 'get',
    params: params
  })
}

// 塔编辑
export const updateTower = (entityTemp) => {
  return axios.request({
    url: '/pot/updateTower',
    method: 'post',
    data: entityTemp
  })
}

// 根据id，分区编码、塔编码删除塔
export const deleteTower = (params) => {
  return axios.request({
    url: '/pot/deleteTower',
    method: 'get',
    params: params
  })
}

// 根据罐id分区编码塔编码获取当前盒编码
export const getBoxInfo = (params) => {
  return axios.request({
    url: '/pot/getCurrentBoxCode',
    method: 'get',
    params: params
  })
}

// 添加盒
export const addBox = (entityTemp) => {
  return axios.request({
    url: '/pot/addBox',
    method: 'post',
    data: entityTemp
  })
}

// 获取盒数据
export const getBoxByParams = (params) => {
  return axios.request({
    url: '/pot/getBoxByParams',
    method: 'get',
    params: params
  })
}

// 盒编辑
export const updateBox = (entityTemp) => {
  return axios.request({
    url: '/pot/updateBox',
    method: 'post',
    data: entityTemp
  })
}

// 删除盒
export const deleteBoxByParams = (params) => {
  return axios.request({
    url: '/pot/deleteBoxByParams',
    method: 'post',
    params: params
  })
}
// 根据罐id获取液氮罐分区图，现在每个罐最多只有一张图
export const getMapFile = (potId) => {
  return axios.request({
    url: '/pot/getMapFile',
    method: 'get',
    params: {
      potId
    }
  })
}
// 根据罐id与上传文件id更新分区图
export const updateMapFile = (potId, mediaId) => {
  return axios.request({
    url: '/pot/updateMapFile',
    method: 'get',
    params: {
      potId,
      mediaId
    }
  })
}
