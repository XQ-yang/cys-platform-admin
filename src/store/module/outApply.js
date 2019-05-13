export default {
  state: {
  // 细胞出库申请列表选中状态
    outApplyListSate: ''
  },
  mutations: {
    // 设置细胞出库申请列表选中状态
    setOutApplyListSate(state, outApplyListSate) {
      state.outApplyListSate = outApplyListSate
    }
  }
}
