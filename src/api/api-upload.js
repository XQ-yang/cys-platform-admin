import axios from '@/libs/api.request'

/**
 * 获取OSS签名
 */
export const getSignature = () => {
  return axios.request({
    url: '/aliyun_oss/get_signature',
    method: 'get'
  })
}
