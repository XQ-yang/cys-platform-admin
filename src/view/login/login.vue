
<template>
  <div class="login">
    <div class="login-con login-content">
      <Card icon="log-in" title=" " :bordered="false">
        <div class="form-con">
          <login-form   @on-success-valid="handleSubmit"></login-form>
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
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit({ userName, password }) {
      const msg = this.$Message.loading({
        content: '正在登录...',
        duration: 0
      })
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          window.localStorage.removeItem('tagNaveList')
          this.$router.push({
            name: this.$config.homeName
          })
          msg()
        })
      }).catch(error => {
        msg()
        this.$Message.error(error.msg)
      })
    }
  }
}
</script>

<style lang="less" >

 @import './login.less';
 @import './login-edit.less';

</style>
