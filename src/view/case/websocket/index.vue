<template>
  <div>
    <div>{{message}}</div>
    <Button class="search-btn" @click="sendOneMessage()">单点消息</Button>
    <Button class="search-btn" @click="sendAllMessage()">全局消息</Button>
  </div>
</template>

<script>

import { sendOneWebSocket, sendAllWebSocket } from '@/api/websocket'
export default {
  name: '',
  data() {
    return {
      id: '',
      message: 'helloWord!',
      query: {
        userName: this.$store.state.user.userName
      }
    }
  },

  components: {},

  created() { // 页面创建生命周期函数
    this.initWebSocket()
  },
  destroyed: function() { // 离开页面生命周期函数
    this.websocketclose()
  },

  methods: {
    initWebSocket: function() {
      const baseUrl = this.$baseUrl.replace('http', 'ws').replace('https', 'ws')
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      this.websock = new WebSocket(baseUrl + '/websocket_service/' + this.$store.state.user.userName)
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen: function() {
      console.log('WebSocket连接成功')
    },
    websocketonerror: function(e) {
      console.log('WebSocket连接发生错误')
    },
    websocketonmessage: function(e) {
      this.message = e.data
    },
    websocketclose: function(e) {
      // console.log('connection closed (' + e.code + ')')
    },
    sendOneMessage: function(e) {
      sendOneWebSocket(this.query)
    },
    sendAllMessage: function(e) {
      sendAllWebSocket()
    }
  }
}

</script>
<style>
</style>
