/*
    node proxy.js
 */
const http = require('http')
const request = require('request')
const hostname = '127.0.0.1'
const port = '8010'

// 创建一个API代理服务，转发请求，实现本地开发vue-cli跨域问题
const apiServer = http.createServer((req, res) => {
  // 代理地址
  const url = 'http://127.0.0.1:8092' + req.url

  var method1 = req.method
  // PUT 和 DELETE 请求经过代理 会变成OPTIONS
  // 非简单请求（简单请求GET,POST,OPTIONS）的跨域请求，会在正式通信之前，增加一次HTTP查询请求，称为”预检”请求（preflight),在post,put,delete发送之前发送一个 OPTIONS 请求，以判断服务端是否允许这一域访问.
  // 当服务端返回200并加上跨域请求头，客户端才会发起正式请求
  if (method1 === 'OPTIONS') {
    // method1 = req.headers['access-control-request-method']
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key,X-URL-PATH')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.statusCode = 200

    res.end(JSON.stringify({ msg: '', data: res.data.data, code: 200 }))
    return
  }
  const options = {
    url: url,
    method: method1
  }
  function callback(error, response, body) {
    if (!error && parseInt(response.statusCode / 10) === 20) {
      res.setHeader('Content-Type', 'application/json;charset=UTF-8')
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key,X-URL-PATH')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.end(body)
    }
  }
  request(options, callback)
})
// 监听端口8010
apiServer.listen(port, hostname, () => {

})
