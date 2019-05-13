import axios from '@/libs/api.request'

// 待采集列表按条件查询
export const getWaitList = (waitCollectQuery) => {
  return axios.request({
    url: '/sampleCollect/getWaitCollectList',
    method: 'get',
    params: waitCollectQuery
  })
}

// 根据预约id获取预约信息
export const getAppointmentById = (id) => {
  return axios.request({
    url: '/sampleCollect/getAppointmentById',
    method: 'get',
    params: { id: id }
  })
}

// 根据样本id获取样本信息
export const getSampleById = (id) => {
  return axios.request({
    url: '/sampleCollect/getSampleById',
    method: 'get',
    params: { id: id }
  })
}

// 修改样本信息
export const updateSample = (sampleTemp) => {
  return axios.request({
    url: '/sampleCollect/updateSample',
    method: 'post',
    data: sampleTemp
  })
}

// 新增样本信息
export const createSample = (sampleTemp) => {
  return axios.request({
    url: '/sampleCollect/addSample',
    method: 'post',
    data: sampleTemp
  })
}

// 采集台账列表按条件查询
export const getBookList = (sampleQuery) => {
  return axios.request({
    url: '/sampleCollect/getCollectBookList',
    method: 'get',
    params: sampleQuery
  })
}

// 异常数据列表列表按条件查询
export const getExceptionList = (exceptionQuery) => {
  return axios.request({
    url: '/sampleCollect/getExceptionList',
    method: 'get',
    params: exceptionQuery
  })
}

// 关闭异常数据
export const closeException = (id, operateType) => {
  return axios.request({
    url: '/sampleCollect/closeException',
    method: 'get',
    params: { id, operateType }
  })
}

