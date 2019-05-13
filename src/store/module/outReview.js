export default {
  state: {
  // 细胞出库审核列表选中状态
    outReviewListSate: ''
  },
  mutations: {
    // 设置细胞出库审核列表选中状态
    setOutReviewListSate(state, outReviewListSate) {
      state.outReviewListSate = outReviewListSate
    }
  }
}
