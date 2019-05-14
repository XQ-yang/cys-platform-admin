import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/todo/getPageList',
    method: 'get',
    params: query
  })
}

export const addTodoSet = (reportFileTemp) => {
  return axios.request({
    url: '/todo/add',
    method: 'post',
    data: reportFileTemp
  })
}
export const editTodoSet = (reportFileTemp) => {
  return axios.request({
    url: '/todo/edit',
    method: 'post',
    data: reportFileTemp
  })
}
export const deleteTodoSet = (id) => {
  return axios.request({
    url: '/todo/delete',
    method: 'post',
    params: { id }
  })
}

// 根据顾客id获取顾客信息
export const getTodoSetById = (id) => {
  return axios.request({
    url: '/todo/getById',
    method: 'get',
    params: { id: id }
  })
}

export const getTodoList = (query) => {
  return axios.request({
    url: '/todo/getTodoList',
    method: 'post',
    data: query
  })
}

export const getTodoListXunJian = (query) => {
  return axios.request({
    url: '/todo/getTodoListByXunJian',
    method: 'post',
    data: query
  })
}

export const getTodoStatusList = (query) => {
  return axios.request({
    url: '/todo/getTodoStatusList',
    method: 'post',
    data: query
  })
}

