import axios from '@/libs/api.request'

// 分页获取出库待审核列表
export const getOutReviewList = (queryList) => {
  return axios.request({
    url: '/outReview/getOutReviewList',
    method: 'get',
    params: queryList
  })
}

// 分页获取出库审核台账列表
export const getOutReviewBookList = (queryList) => {
  return axios.request({
    url: '/outReview/getOutReviewBookList',
    method: 'get',
    params: queryList
  })
}

// 出库审核提交
export const addOutReview = (outReviewTemp) => {
  return axios.request({
    url: '/outReview/addOutReview',
    method: 'post',
    data: outReviewTemp
  })
}

// 加载出库审核查看信息
export const getOutReviewViewInfo = (reviewId) => {
  return axios.request({
    url: '/outReview/getOutReviewViewInfo',
    method: 'get',
    params: { reviewId: reviewId }
  })
}
