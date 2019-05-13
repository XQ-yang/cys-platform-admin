import axios from '@/libs/api.request'

// 分页获取库存待出库列表
export const getOutStockList = (queryList) => {
  return axios.request({
    url: '/outStock/getOutStockList',
    method: 'get',
    params: queryList
  })
}

// 分页获库存出库台账列表
export const getOutStockBookList = (queryList) => {
  return axios.request({
    url: '/outStock/getOutStockBookList',
    method: 'get',
    params: queryList
  })
}

// 加载库存出库信息
export const getOutStockInfo = (cellOutStoreId) => {
  return axios.request({
    url: '/outStock/getOutStockInfo',
    method: 'get',
    params: { cellOutStoreId: cellOutStoreId }
  })
}

// 新增库存出库信息
export const addoutStock = (outStockTemp) => {
  return axios.request({
    url: '/outStock/addoutStock',
    method: 'post',
    data: outStockTemp
  })
}

// 加载库存出库查看信息
export const getOutStockViewInfo = (cellOutStoreId) => {
  return axios.request({
    url: '/outStock/getOutStockViewInfo',
    method: 'get',
    params: { cellOutStoreId: cellOutStoreId }
  })
}
