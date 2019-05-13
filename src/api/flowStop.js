import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/flowstop/getPageList',
    method: 'get',
    params: query
  })
}
export const addflowStop = (flowStopTemp) => {
  return axios.request({
    url: '/flowstop/add',
    method: 'post',
    data: flowStopTemp
  })
}

export const deleteflowStop = (id) => {
  return axios.request({
    url: '/flowstop/delete',
    method: 'post',
    params: { id }
  })
}
export const editFlowStop = (flowStopTemp) => {
  return axios.request({
    url: '/flowstop/edit',
    method: 'post',
    data: flowStopTemp
  })
}

export const getFlowStop = (id) => {
  return axios.request({
    url: '/flowstop/getFlowStop',
    method: 'post',
    params: { id }
  })
}

// 获取报废出库细胞相关视图信息
export const getFlowStopView = (id) => {
  return axios.request({
    url: '/flowstop/getFlowStopView',
    method: 'get',
    params: { id }
  })
}

// 提交报废出库
export const outStock = (id) => {
  return axios.request({
    url: '/flowstop/outStock',
    method: 'get',
    params: { id }
  })
}
