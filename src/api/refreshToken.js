import axios from '@/libs/api.request'
import qs from 'qs'
import { setToken, localRead, localSave } from '@/libs/util'

export default async() => {
  let grant_type = 'password'
  let client_id = 'admin-web'
  let client_secret = '4402b06a67334d769fed712453284dae'
  let refresh_token = localRead('refreshToken')
  const refreshData = {
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token
  }
  try {
    const { code, data } = await axios.request({
      url: '/oauth/token',
      data: qs.stringify(refreshData),
      method: 'post'
    })
    if (code === 1011) { // 刷新token失效
      window.location.href = '/login'
    } else {
      const { access_token, refresh_token } = data
      if (access_token && refresh_token) {
        setToken('token', access_token)
        localSave('refreshToekn', refresh_token)
      }
      return { code, data }
    }
  } catch (error) {
    console.log(error)
  }
}
