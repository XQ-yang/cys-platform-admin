export default {
  state: {
    // 细胞出库列表选中状态
    retrospectSate: ''
  },
  mutations: {
    // 设置细胞出库列表选中状态
    setRetrospectSate(state, retrospectSate) {
      state.retrospectSate = retrospectSate
    }
  }
}
