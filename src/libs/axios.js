import axios from 'axios'
import { getToken } from '@/libs/util'
import { Message as Msg } from 'iview'

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'X-URL-PATH': location.pathname
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(request => {
      if (!request.url.includes('/oauth/token')) {
        request.headers['Content-type'] = 'application/json;charset=UTF-8'
        if (getToken()) {
          request.headers['Authorization'] = 'Bearer ' + getToken()
        } else {
          // 如果token过期或者不存在则跳转到登录页面
          window.location.href = '/login'
        }
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show()
      }

      this.queue[url] = true
      return request
    }, error => {
      this.destroy(url)
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if (res.data.code !== 2000 && !url.includes('/oauth/token')) {
        // token 过期应该返回登陆页面
        if (res.data.code === 1400 || res.data.code === 1401) {
          Msg.error('未登录，或者登录已过期，请登录')
          window.location.href = '/login'
        }
        return Promise.reject(res.data)
      } else {
        return res.data
      }
    }, error => {
      // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
      this.destroy(url)
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '错误请求'
            break
          case 401:
            // 如果token过期或者不存在则跳转到登录页面
            window.location.href = '/login'
            // Msg.error('未登录，或者登录已过期，请登录')
            error.message = '未授权，请重新登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = '请求错误，未找到资源'
            break
          case 405:
            error.message = '请求方法未允许'
            break
          case 408:
            error.message = '请求超时'
            break
          case 500:
            error.message = '服务器端出错'
            break
          case 501:
            error.message = '网络未实现'
            break
          case 502:
            error.message = '网络错误'
            break
          case 503:
            error.message = '服务不可用'
            break
          case 504:
            error.message = '网络超时'
            break
          case 505:
            error.message = 'http版本不支持请求'
            break
          default:
            error.message = `链接错误${error.response.status}`
        }
      } else {
        error.message = '链接服务器失败'
      }
      return Promise.reject(error.message)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
