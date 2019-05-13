import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/reservation/getPageList',
    method: 'get',
    params: query
  })
}

export const deleteReservation = (id) => {
  return axios.request({
    url: '/reservation/delete',
    method: 'post',
    params: { id }
  })
}

export const edit = (reservationTemp) => {
  return axios.request({
    url: '/reservation/edit',
    method: 'post',
    data: reservationTemp
  })
}
