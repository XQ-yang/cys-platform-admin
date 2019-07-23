<template>
  <div>
    <div>{{message}}</div>
    <Button class="search-btn" @click="sendOneMessage()">单点消息</Button>
    <Button class="search-btn" @click="sendAllMessage()">全局消息</Button>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      id: '',
      message: 'helloWord!'
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
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      this.websock = new WebSocket('ws://localhost:8046/websocket/DPS007')
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
      var da = JSON.parse(e.data)
      this.message = da
    },
    websocketclose: function(e) {
      console.log('connection closed (' + e.code + ')')
    }
  }
}

</script>
<style>
</style>
