export default {
  state: {
    flowStopState: '' // 细胞报废申请tabs状态
  },
  mutations: {
    setFlowStopState(state, flowStopState) {
      state.flowStopState = flowStopState
    }
  }
}
