import axios from '@/libs/api.request'

// 分页获取短信列表
export const getPageList = (query) => {
  return axios.request({
    url: '/sms-send/get_page_list',
    method: 'get',
    params: query
  })
}

// 短信发送失败的记录重新发送
export const recordReSend = (data) => {
  return axios.request({
    url: '/sms-send/record-resend',
    method: 'post',
    data: data
  })
}

// 同步短信发送回执
export const getSmsSendReceipt = (id) => {
  return axios.request({
    url: '/sms-send/get_sms_send_receipt',
    method: 'get',
    params: { id }
  })
}
