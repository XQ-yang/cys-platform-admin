import axios from '@/libs/api.request'

export const fetchList = (query, pageNum, pageSize) => {
  return axios.request({
    url: '/equipment/equipmentList',
    method: 'post',
    data: query,
    params: { pageNum, pageSize }
  })
}

export const getEquipDetail = (id, equId) => {
  return axios.request({
    url: '/equipment/get_detail',
    method: 'get',
    params: { id, equId }
  })
}

export const existEquId = (id) => {
  return axios.request({
    url: '/equipment/existEquId',
    method: 'get',
    params: { id }
  })
}

export const addOrUpdateEquipment = (dataForm) => {
  return axios.request({
    url: '/equipment/save',
    method: 'post',
    data: dataForm
  })
}

export const delEquipment = (id) => {
  return axios.request({
    url: '/equipment/remove',
    method: 'post',
    data: id
  })
}

export const updateFinanceStatusBatch = (stateForm) => {
  return axios.request({
    url: '/equipment/batchModFin',
    method: 'post',
    data: stateForm
  })
}

export const updateUseStatusBatch = (stateForm) => {
  return axios.request({
    url: '/equipment/batchModUse',
    method: 'post',
    data: stateForm
  })
}

export const updateUseStatus = (id, status) => {
  return axios.request({
    url: '/equipment/updateUseStatus',
    method: 'post',
    params: { id, status }
  })
}

export const updateUseStatusForRepairOrRecipients = (dataForm, id, status) => {
  return axios.request({
    url: '/equipment/updateUseStatus',
    method: 'post',
    data: dataForm,
    params: { id, status }
  })
}

export const getUsageRecord = (equId,) => {

}
