<template>
  <img :src="captchaUrl" alt="验证码" title="刷新验证码" @click="refreshCode" />
</template>
<script>
import { uuid } from '@/libs/tools.js'
export default {
  name: 'Captcha',
  props: {
    value: {
      type: String,
      default: null
    },
    refreshSeconds: {
      type: Number,
      default: 90
    }
  },
  data() {
    return {
      intervalTimer: null,
      captchaUrl: null,
      generateKey: null
    }
  },
  created() {
    this.refreshCode()
  },
  methods: {
    refreshCode() {
      // 如果定时器存在, 清除之前的定时器
      if (this.intervalTimer) {
        clearInterval(this.intervalTimer)
      }
      this.generateKey = uuid()
      this.$emit('input', this.generateKey)
      this.captchaUrl = this.$baseUrl + '/captcha/index/' + this.generateKey
      // 重新定时90s后自动刷新验证码
      this.intervalTimer = setInterval(() => this.refreshCode(), 1000 * this.refreshSeconds)
    }
  }
}
</script>
