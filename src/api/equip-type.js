import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/equip_type/get_list',
    method: 'get',
    params: query
  })
}

export const typeSelectList = () => {
  return axios.request({
    url: '/equip_type/typeSelectList',
    method: 'get'
  })
}

export const addOrUpdateEquipType = (equipTypeTemp) => {
  return axios.request({
    url: '/equip_type/save',
    method: 'post',
    data: equipTypeTemp
  })
}

export const getEquipTypeInfo = (id) => {
  return axios.request({
    url: '/equip_type/get_info',
    method: 'get',
    params: { id }
  })
}

export const exportExcel = (query) => {
  return axios.request({
    url: '/equip_type/export',
    method: 'post',
    data: query
  })
}

export const downloadTemplate = () => {
  return axios.request({
    url: '/equip_type/download_template',
    method: 'get'
  })
}

export const deleteEquipType = (id) => {
  return axios.request({
    url: '/equip_type/remove',
    method: 'post',
    data: id
  })
}

export const modifyStatus = (id, status) => {
  return axios.request({
    url: '/equip_type/editStatus',
    method: 'get',
    params: { id, status }
  })
}

export const batchEditStatus = (stateFrom) => {
  return axios.request({
    url: '/equip_type/batchEditStatus',
    method: 'post',
    data: stateFrom
  })
}
