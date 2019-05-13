import axios from '@/libs/api.request'

// 获取模板信息发送配置列表
export const getConfList = (query) => {
  return axios.request({
    url: '/templateMsg/getConfList',
    method: 'get',
    params: query
  })
}

// 根据模板信息配置id获取配置
export const getConfById = (confId) => {
  return axios.request({
    url: '/templateMsg/getConfById',
    method: 'get',
    params: { confId }
  })
}

// 编辑模板信息配置
export const confUpdate = (msgConf) => {
  return axios.request({
    url: '/templateMsg/confUpdate',
    method: 'post',
    data: msgConf
  })
}

// 变更模板信息是否自动发送
export const autoSendChange = (autoSendChange) => {
  return axios.request({
    url: '/templateMsg/autoSendChange',
    method: 'post',
    data: autoSendChange
  })
}
