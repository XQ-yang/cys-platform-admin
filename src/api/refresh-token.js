import axios from '@/libs/api.request'
import qs from 'qs'
import { setToken, localRead, localSave } from '@/libs/util'
import router from '@/router/index'
export default async() => {
  let grant_type = 'refresh_token'
  let client_id = 'admin-web'
  let client_secret = '4402b06a67334d769fed712453284dae'
  let refresh_token = localRead('refreshToken')
  let auth_type = 'admin-web'
  const refreshData = {
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
    auth_type: auth_type
  }
  try {
    const res = await axios.request({
      url: '/oauth/token',
      data: qs.stringify(refreshData),
      method: 'post'
    })
    const { access_token, refresh_token } = res
    if (access_token && refresh_token) {
      setToken(access_token)
      localSave('refreshToken', refresh_token)
    }
    return res
  } catch (error) {
    if (error.code && error.code === 1011) {
      setToken('')
      localSave('refreshToken', '')
      error.msg = '登录已过期, 请重新登录！'
      router.replace({ path: '/login', query: { redirect: router.currentRoute.fullPath }})
    }
    throw error
  }
}
