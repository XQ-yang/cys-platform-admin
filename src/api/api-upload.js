import axios from '@/libs/api.request'

export const getSignature = () => {
  return axios.request({
    url: '/aliyun_oss/get_signature',
    method: 'get'
  })
}
