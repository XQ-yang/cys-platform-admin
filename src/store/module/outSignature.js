export default {
  state: {
  // 签字确认列表选中状态
    outSignatureListSate: ''
  },
  mutations: {
    // 设置签字确认列表选中状态
    setOutSignatureListSate(state, outSignatureListSate) {
      state.outSignatureListSate = outSignatureListSate
    }
  }
}
