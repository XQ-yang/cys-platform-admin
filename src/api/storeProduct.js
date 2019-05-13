import axios from '@/libs/api.request'

export const fetchList = (query) => {
  return axios.request({
    url: '/storeproduct/getPageList',
    method: 'get',
    params: query
  })
}

export const addStoreProduct = (storeProductTemp) => {
  return axios.request({
    url: '/storeproduct/add',
    method: 'post',
    data: storeProductTemp
  })
}
export const deleteStoreProduct = (id) => {
  return axios.request({
    url: '/storeproduct/delete',
    method: 'post',
    params: { id }
  })
}
export const editStoreProduct = (storeProductTemp) => {
  return axios.request({
    url: '/storeproduct/edit',
    method: 'post',
    data: storeProductTemp
  })
}

// 验证物料编号是否存在，是返回true
export const existMaterialNo = (materialNo) => {
  return axios.request({
    url: '/storeproduct/existMaterialNo',
    method: 'get',
    params: {
      materialNo
    }
  })
}

// 验证物料批号是否存在，是返回true
export const existBatchNo = (batchNo) => {
  return axios.request({
    url: '/storeproduct/existBatchNo',
    method: 'get',
    params: {
      batchNo
    }
  })
}

// 根据物料id判断是否有关联库存，是返回true
export const isUsedStock = (productId) => {
  return axios.request({
    url: '/storeproduct/isUsedStock',
    method: 'get',
    params: {
      productId
    }
  })
}
