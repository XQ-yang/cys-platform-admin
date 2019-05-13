import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/storeStock/getPageList',
    method: 'get',
    params: query
  })
}

export const addStoreStock = (storeStockTemp) => {
  return axios.request({
    url: '/storeStock/add',
    method: 'post',
    data: storeStockTemp
  })
}
export const deleteStoreStock = (id) => {
  return axios.request({
    url: '/storeStock/delete',
    method: 'post',
    params: {
      id
    }
  })
}
export const editStoreStock = (storeStockTemp) => {
  return axios.request({
    url: '/storeStock/edit',
    method: 'post',
    data: storeStockTemp
  })
}

// 验证批号号是否存在，是返回true
export const existBatchNumber = (batchNumber) => {
  return axios.request({
    url: '/storeStock/existBatchNumber',
    method: 'get',
    params: {
      batchNumber
    }
  })
}

// 根据库存id判断是否已有领用，是返回true
export const isUsedDetail = (stockId) => {
  return axios.request({
    url: '/storeStock/isUsedDetail',
    method: 'get',
    params: {
      stockId
    }
  })
}

// 根据id获取库存数据（编辑获取数据）
export const getStoreStockById = (stockId) => {
  return axios.request({
    url: '/storeStock/getStoreStockById',
    method: 'get',
    params: {
      stockId
    }
  })
}
