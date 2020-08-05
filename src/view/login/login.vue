
<template>
  <div class="login">
    <div class="login-con login-content">
      <Card icon="log-in" title=" " :bordered="false">
        <div class="form-con">
          <login-form ref="loginForm" @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit(userLogin) {
      const msg = this.$Message.loading({
        content: '正在登录...',
        duration: 0
      })
      this.handleLogin(userLogin).then(res => {
        this.getUserInfo().then(res => {
          window.localStorage.removeItem('tagNaveList')
          this.$router.push({
            name: this.$config.homeName
          })
          msg()
        })
      }).catch(error => {
        msg()
        this.$Message.error({
          content: error.msg,
          duration: 5
        })
        // 如果用户名或密码错误, 刷新并清空验证码
        if (error.code === 1012 || error.code === 1013) {
          this.$refs.loginForm.refreshCode()
          this.$refs.loginForm.form.captchaCode = ''
        }
      })
    }
  }
}
</script>

<style lang="less" >

 @import './login.less';
 @import './login-edit.less';

</style>
