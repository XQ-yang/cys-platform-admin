import axios from '@/libs/api.request'
import qs from 'qs'
import { localRead } from '@/libs/util'
/**
 * 刷新token
*/
export const refreshToken = () => {
  let grant_type = 'password'
  let client_id = 'admin-web'
  let client_secret = '4402b06a67334d769fed712453284dae'
  let refresh_token = localRead('refreshToken')
  const data = {
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token
  }
  return axios.request({
    url: '/oauth/token',
    data: qs.stringify(data),
    method: 'post'
  })
}
