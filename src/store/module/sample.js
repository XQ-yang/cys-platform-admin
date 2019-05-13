
export default {
  state: {
  // 采集列表选中状态
    collectListSate: '',
    // 运输列表选中状态
    transportListSate: '',
    // 验收列表选中状态
    receivetListSate: '',
    // 样本采集运输工作台选中状态
    sampleDeskSate: ''
  },
  mutations: {
    // 设置采集列表选中状态
    setCollectListSate(state, collectListSate) {
      state.collectListSate = collectListSate
    },
    // 设置运输列表选中状态
    setTransportListSate(state, transportListSate) {
      state.transportListSate = transportListSate
    },
    // 设置验收列表选中状态
    setReceiveListSate(state, receivetListSate) {
      state.receivetListSate = receivetListSate
    },
    // 设置样本采集运输工作台选中状态
    setSampleDeskSate(state, sampleDeskSate) {
      state.sampleDeskSate = sampleDeskSate
    }
  }
}
