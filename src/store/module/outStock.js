export default {
  state: {
  // 细胞库存出库列表选中状态
    outStockListSate: ''
  },
  mutations: {
    // 设置细胞库存出库列表选中状态
    setOutStockListSate(state, outStockListSate) {
      state.outStockListSate = outStockListSate
    }
  }
}
