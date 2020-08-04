import axios from 'axios'
import { getToken } from '@/libs/util'
import refreshToken from '@/api/refresh-token'
let isLock = false
let requests = []

// 读取Blob转为String
function readBlobAsStr(blob) {
  return new Promise((resolve, reject) => {
    // // 下面这种方式在ie上不兼容
    // let blobStr = await (new Response(data)).text()
    let reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsText(blob, 'utf-8')
  })
}

// 读取Blob转为json
async function readBlobAsJson(blob) {
  let blobStr = await readBlobAsStr(blob)
  return JSON.parse(blobStr)
}

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'X-URL-PATH': location.pathname,
        'Authorization': 'Bearer ' + getToken()
      }
    }
    return config
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(request => {
      if (!request.url.includes('/oauth/token')) {
        request.headers['Content-type'] = 'application/json;charset=UTF-8'
      }
      return request
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(async response => {
      let data = response.data
      if (data instanceof Blob && data.type && data.type.indexOf('application/json') > -1) {
        data = await readBlobAsJson(data)
      }
      if (data.code && data.code !== 2000) {
        // token 过期应该返回登陆页面
        if (data.code === 1010) {
          if (!isLock) {
            isLock = true
            try {
              await refreshToken()
            } finally {
              isLock = false
            }
            const token = getToken()
            // 获取到token之后, 将之前缓存的请求重试执行
            requests.forEach(fun => fun(token))
            requests = []
            // 重新获取最新token
            response.config.headers.Authorization = 'Bearer ' + token
            // 执行上一次请求
            return instance(response.config)
          } else {
            // 正在刷新token, 将返回的一个未执行resolve的promise
            return new Promise(resolve => {
              // 将resolve放进队列, 用一个函数形式来保存, 等token刷新后直接执行
              requests.push(token => {
                response.config.headers.Authorization = 'Bearer ' + token
                // 因为这里我们的路径是`http/https`开头的绝对路径, 不是`/api`开头的相对路径, 所以不需要将`baseURL`置空, 如果是相对路径, 记得重置
                resolve(instance(response.config))
              })
            })
          }
        } else if (data.code !== 1010) {
          return Promise.reject(data)
        }
      } else if (data instanceof Blob) {
        /**
         * 只需要判断是否是Blob对象, 是则直接返回二进制流
         * response.headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8' ||
         * response.headers['content-type'] === 'application/vnd.ms-word;charset=UTF-8' ||
         * response.headers['content-type'] === 'application/x-download;charset=UTF-8'
         */
        return response
      } else {
        return data
      }
    }, error => {
      // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '错误请求'
            break
          case 401:
            // 如果token过期或者不存在则跳转到登录页面
            // window.location.href = '/login'
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
    // 解构对象
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
