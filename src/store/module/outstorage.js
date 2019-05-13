
export default {
  state: {
  // 细胞出库列表选中状态
    cellOutStorageListSate: ''
  },
  mutations: {
    // 设置细胞出库列表选中状态
    setCellOutStorageListSate(state, cellOutStorageListSate) {
      state.cellOutStorageListSate = cellOutStorageListSate
    }
  }
}
