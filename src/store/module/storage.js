
export default {
  state: {
    // 细胞培养管理tab选中状态
    cellCultureListSate: '',
    // 细胞暂存管理tab选中状态
    cellTempStoreSate: '',
    // 细胞质检管理tab选中状态
    cellQualityCheckSate: '',
    // 细胞入库/复核管理tab选中状态
    cellStoreSate: '',
    // 细胞工作台管理tab选中状态
    storageDeskSate: ''
  },
  mutations: {
    // 设置tab选中状态
    setCellCultureListSate(state, cellCultureListSate) {
      state.cellCultureListSate = cellCultureListSate
    },
    setCellTempStoreSate(state, cellTempStoreSate) {
      state.cellTempStoreSate = cellTempStoreSate
    },
    setCellQualityCheckSate(state, cellQualityCheckSate) {
      state.cellQualityCheckSate = cellQualityCheckSate
    },
    setCellStoreSate(state, cellStoreSate) {
      state.cellStoreSate = cellStoreSate
    },
    setStorageDeskSate(state, storageDeskSate) {
      state.storageDeskSate = storageDeskSate
    }
  },
  actions: {
    // 设置tab选中状态
    setCellCultureListSate({ commit }, { cellCultureListSate }) {
      commit('setCellCultureListSate', cellCultureListSate)
    },
    setCellTempStoreSate({ commit }, { cellTempStoreSate }) {
      commit('setCellTempStoreSate', cellTempStoreSate)
    },
    setCellQualityCheckSate({ commit }, { cellQualityCheckSate }) {
      commit('setCellQualityCheckSate', cellQualityCheckSate)
    },
    setCellStoreSate({ commit }, { cellStoreSate }) {
      commit('setCellStoreSate', cellStoreSate)
    },
    setStorageDeskSate({ commit }, { storageDeskSate }) {
      commit('setStorageDeskSate', storageDeskSate)
    }
  }
}
