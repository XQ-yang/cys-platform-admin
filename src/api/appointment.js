import axios from '@/libs/api.request'

// 获取预约分页列表
export const getAppointmentList = (query) => {
  return axios.request({
    url: '/appointment/getAppointmentList',
    method: 'get',
    params: query
  })
}

// 预约保存
export const saveAppointment = (appointmentTemp) => {
  return axios.request({
    url: '/appointment/saveAppointment',
    method: 'post',
    data: appointmentTemp
  })
}

// 预约删除
export const deleteByAppointmentById = (id) => {
  return axios.request({
    url: '/appointment/deleteByAppointmentById',
    method: 'get',
    params: id
  })
}
