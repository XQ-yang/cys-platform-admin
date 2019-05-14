import axios from '@/libs/api.request'

export const getPostionList = () => {
  return axios.request({
    url: '/postion/getList',
    method: 'get'
  })
}

export const fetchList = (query) => {
  return axios.request({
    url: '/postion/getPageList',
    method: 'get',
    params: query
  })
}

export const editPostion = (postionTemp) => {
  return axios.request({
    url: '/postion/edit',
    method: 'post',
    data: postionTemp
  })
}

export const addPostion = (postionTemp) => {
  return axios.request({
    url: '/postion/add',
    method: 'post',
    data: postionTemp
  })
}

export const deletePostion = (id) => {
  return axios.request({
    url: '/postion/delete',
    method: 'post',
    params: { id }
  })
}
