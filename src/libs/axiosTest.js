import axios from 'axios'
import { getToken, localRead } from '@/libs/util'
import { Message as Msg } from 'iview'
import config from '@/config'
import refreshToken from '@/api/refreshToken'

// axios 配置
axios.defaults.timeout = 1000 * 60 * 5
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// 配置通用请求动画
let isLock = true

/**
 * 通用请求拦截配置
 * @param {*} config
 */
const axiosConf = (config) => {
  config.headers.Authorization = 'Bearer ' + getToken()
  return config
}
axios.interceptors.request.use(axiosConf, err => {
  return Promise.reject(err)
})
// http response 拦截器
axios.interceptors.response.use(async(response) => {
  let data = {}
  if (response && response.data) {
    let code = Number(response.code || response.data.code)
    if (code === 401) { // 401 清除token信息并跳转到登录页面
      const refreshJwt = localRead(`refreshToekn`)
      if ((refreshJwt !== 'undefined' && refreshJwt) && isLock) {
        await refreshToken(response)
        isLock = false // 这里防止并发的时候造成死循环,所以要加锁
        // 刷新完成,继续之前的请求
        response.config.headers.Authorization = getToken()
        const result = await axios.request(axiosConf(response.config))
        if (result) {
          data = result
          isLock = true
        }
      } else {
        Msg.error((response.data && response.data.msg) || `身份过期，请重新登录!`)
        window.location.href = '/login'
      }
    } else if (code === 200) {
      data = response.data
    } else if (code === 403) { // 无权限
      Msg.error(`无权访问!`)
    } else if (code === 410) {
      Msg.error(`身份过期，请重新登录!`)
      window.location.href = '/login'
    } else {
      Msg.error((response.data && response.data.msg) || '网络连接出错!请稍后刷新重试!')
    }
  }
  return data
}, (error) => {
  console.log(`object`, error)
  Msg.error('哎呀~ (ಥ﹏ಥ)网络又开小差了,请稍后刷新重试!')
  return Promise.reject(error.response.data)
})

export default axios
