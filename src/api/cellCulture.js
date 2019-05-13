import axios from '@/libs/api.request'

// 细胞待培养分页查询
export const getPageCellCultureList = (query) => {
  return axios.request({
    url: '/cellCulture/getPageCellCultureList',
    method: 'get',
    params: query
  })
}

// 细胞培养台账分页查询
export const getPageCellCultureDeskList = (query) => {
  return axios.request({
    url: '/cellCulture/getPageCellCultureDeskList',
    method: 'get',
    params: query
  })
}

// 根据样本id获取, 样本信息; 对应顾客信息; 及已培养的细胞信息列表
export const getCellCultureView = (sampleId) => {
  return axios.request({
    url: '/cellCulture/getCellCultureView',
    method: 'get',
    params: { sampleId: sampleId }
  })
}

// 新增细胞培养信息
export const addCellCulture = (cellCulture) => {
  return axios.request({
    url: '/cellCulture/addCellCulture',
    method: 'post',
    data: cellCulture
  })
}

// 校验该细胞编码是否已经被使用
export const existProduceNumber = (produceNumber) => {
  return axios.request({
    url: '/cellCulture/existProduceNumber',
    method: 'get',
    params: { produceNumber: produceNumber }
  })
}

// 细胞待暂存分页查询
export const getPageTempStoreList = (query) => {
  return axios.request({
    url: '/tempStore/getPageTempStoreList',
    method: 'get',
    params: query
  })
}

// 细胞暂存台账分页查询
export const getPageTempStoreDeskList = (query) => {
  return axios.request({
    url: '/tempStore/getPageTempStoreDeskList',
    method: 'get',
    params: query
  })
}

// 暂存新增时根据已培养的细胞信息cellCultureId获取: 样本信息; 对应顾客信息; 及该已培养的细胞信息
export const getTempStoreAddView = (cellCultureId) => {
  return axios.request({
    url: '/tempStore/getTempStoreAddView',
    method: 'get',
    params: { cellCultureId: cellCultureId }
  })
}

// 根据细胞暂存信息 tempStoreId 获取该次暂存的细胞位置信息
export const getTempStoreView = (tempStoreId) => {
  return axios.request({
    url: '/tempStore/getTempStoreView',
    method: 'get',
    params: { tempStoreId: tempStoreId }
  })
}

// 新增细胞暂存信息
export const addTempStore = (tempStore) => {
  return axios.request({
    url: '/tempStore/addTempStore',
    method: 'post',
    data: tempStore
  })
}

// 细胞待质检分页查询
export const getPageQualityCheckList = (query) => {
  return axios.request({
    url: '/qualityCheck/getPageQualityCheckList',
    method: 'get',
    params: query
  })
}

// 质检新增时, 根据已培养的细胞信息cellCultureId获取: 样本信息; 对应顾客信息; 及该已培养的细胞信息
export const getQualityCheckAddView = (cellCultureId) => {
  return axios.request({
    url: '/qualityCheck/getQualityCheckAddView',
    method: 'get',
    params: { cellCultureId: cellCultureId }
  })
}

// 根据细胞质检信息 qualityCheckId 获取该次质检的细胞位置信息
export const getQualityCheckView = (qualityCheckId) => {
  return axios.request({
    url: '/qualityCheck/getQualityCheckView',
    method: 'get',
    params: { qualityCheckId: qualityCheckId }
  })
}

// 新增细胞质检信息
export const addQualityCheck = (qualityCheckAdd) => {
  return axios.request({
    url: '/qualityCheck/addQualityCheck',
    method: 'post',
    data: qualityCheckAdd
  })
}

// 细胞质检台账分页查询
export const getPageQualityCheckDeskList = (query) => {
  return axios.request({
    url: '/qualityCheck/getPageQualityCheckDeskList',
    method: 'get',
    params: query
  })
}

// 分页获取细胞质检异常信息列表
export const getPageQualityCheckExceptionList = (query) => {
  return axios.request({
    url: '/qualityCheck/getPageQualityCheckExceptionList',
    method: 'get',
    params: query
  })
}

// 根据细胞质检qualityCheckId, 关闭质检异常信息
export const closeQualityCheckException = (qualityCheckId) => {
  return axios.request({
    url: '/qualityCheck/closeQualityCheckException',
    method: 'get',
    params: { qualityCheckId: qualityCheckId }
  })
}

// 细胞待入库分页查询
export const getPageWaitStoreList = (query) => {
  return axios.request({
    url: '/store/getPageWaitStoreList',
    method: 'get',
    params: query
  })
}

// 入库新增时, 根据已培养的细胞信息cellCultureId获取: 样本信息; 对应顾客信息; 及该已培养的细胞信息; 质检信息, 质检报告等
export const getStoreAddView = (cellCultureId) => {
  return axios.request({
    url: '/store/getStoreAddView',
    method: 'get',
    params: { cellCultureId: cellCultureId }
  })
}

// 根据细胞入库信息storeId, 获取该次入库的台账细胞查看位置信息
export const getStoreView = (storeId) => {
  return axios.request({
    url: '/store/getStoreView',
    method: 'get',
    params: { storeId: storeId }
  })
}

// 新增细胞入库信息
export const addStore = (storeAdd) => {
  return axios.request({
    url: '/store/addStore',
    method: 'post',
    data: storeAdd
  })
}

// 根据已培养的细胞信息cellCultureId获取待复核: 样本信息; 对应顾客信息; 及该已培养的细胞信息等
export const getRecheckAddView = (cellCultureId) => {
  return axios.request({
    url: '/store/getRecheckAddView',
    method: 'get',
    params: { cellCultureId: cellCultureId }
  })
}

// 细胞待复核分页查询
export const getPageWaitRecheckList = (query) => {
  return axios.request({
    url: '/store/getPageWaitRecheckList',
    method: 'get',
    params: query
  })
}

// 细胞入库台账分页查询
export const getPageStoreDeskList = (query) => {
  return axios.request({
    url: '/store/getPageStoreDeskList',
    method: 'get',
    params: query
  })
}

// 新增细胞复核信息
export const addStoreRecheck = (storeRecheckAdd) => {
  return axios.request({
    url: '/store/addStoreRecheck',
    method: 'post',
    data: storeRecheckAdd
  })
}

// 根据已培养的细胞信息cellCultureId获取,其他报告附件或存储证明上传时: 样本信息; 对应顾客信息; 及该已培养的细胞信息
export const getUploadCultureView = (cellCultureId) => {
  return axios.request({
    url: '/store/getUploadCultureView',
    method: 'get',
    params: { cellCultureId: cellCultureId }
  })
}

// 上传报告附件
export const uploadOtherReportFile = (otherReportFileAdd) => {
  return axios.request({
    url: '/store/uploadOtherReportFile',
    method: 'post',
    data: otherReportFileAdd
  })
}

// 上传存储凭证
export const uploadStorageCardFile = (storageCardFileAdd) => {
  return axios.request({
    url: '/store/uploadStorageCardFile',
    method: 'post',
    data: storageCardFileAdd
  })
}

// 分页获取待移库细胞样本信息列表
export const getPageWaitTransferList = (query) => {
  return axios.request({
    url: '/transfer/getPageWaitTransferList',
    method: 'get',
    params: query
  })
}

// 分页获取移库台账列表信息
export const getPageTransferBookList = (query) => {
  return axios.request({
    url: '/transfer/getPageTransferBookList',
    method: 'get',
    params: query
  })
}

// 根据样本id获取未出库的该样本id下的细胞信息及存储信息列表
export const getStoreCellLocationListBySampleId = (sampleId) => {
  return axios.request({
    url: '/transfer/getStoreCellLocationListBySampleId',
    method: 'get',
    params: { sampleId }
  })
}

// 根据样本id获取细胞移库时要展示的相关样本和顾客信息
export const getTransferAddView = (sampleId) => {
  return axios.request({
    url: '/transfer/getTransferAddView',
    method: 'get',
    params: { sampleId: sampleId }
  })
}

// 新增细胞移库信息
export const addTransfer = (transferAdd) => {
  return axios.request({
    url: '/transfer/addTransfer',
    method: 'post',
    data: transferAdd
  })
}

// 根据细胞移库信息id, 获取该次移库的台账信息查看
export const getTransferView = (transferId) => {
  return axios.request({
    url: '/transfer/getTransferView',
    method: 'get',
    params: { transferId: transferId }
  })
}

export const pageNotStopFlowCellBySampleCode = (query) => {
  return axios.request({
    url: '/cellCulture/pageNotStopFlowCellBySampleCode',
    method: 'get',
    params: query
  })
}
