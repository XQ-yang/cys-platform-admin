import axios from '@/libs/api.request'
import qs from 'qs'
import { setToken, localRead, localSave } from '@/libs/util'

export default async() => {
  let grant_type = 'refresh_token'
  let client_id = 'admin-web'
  let client_secret = '4402b06a67334d769fed712453284dae'
  let refresh_token = localRead('refreshToken')
  console.log(refresh_token)
  const refreshData = {
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token
  }
  try {
    debugger
    const res = await axios.request({
      url: '/oauth/token',
      data: qs.stringify(refreshData),
      method: 'post'
    })
    debugger
    if (res === 1011) { // 刷新token失效
      window.location.href = '/login'
    } else {
      debugger
      const { access_token, refresh_token } = res
      console.log(res)
      if (access_token && refresh_token) {
        setToken('token', access_token)
        localSave('refreshToken', refresh_token)
      }
      return { ...res }
    }
  } catch (error) {
    console.log(error)
  }
}
