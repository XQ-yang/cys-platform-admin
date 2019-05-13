import { Modal } from 'iview'
const beforeClose = {
  before_close_normal: (resolve) => {
    Modal.confirm({
      title: '确定要关闭这一页吗',
      onOk: () => {
        resolve(true)
      },
      onCancel: () => {
        resolve(false)
      }
    })
  },
  // 关闭钩子函数，用于处理页面状态(取样列表)
  clear_collect_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(运输列表)
  clear_transport_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(验收列表)
  clear_receive_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(样本采集运输工作台)
  clear_sample_desk_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(细胞出库列表)
  clear_outstorage_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(细胞出库申请列表)
  clear_out_apply_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(细胞库存出库列表)
  clear_out_stock_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(细胞出库审核列表)
  clear_out_review_state: (resovle) => {
    resovle(true)
  },
  // 关闭钩子函数，用于处理页面状态(签字确认列表)
  clear_out_signature_state: (resovle) => {
    resovle(true)
  },
  // 清空细胞报废申请tab页面状态
  clear_out_flow_stop: (resovle) => {
    resovle(true)
  }
}

export default beforeClose
