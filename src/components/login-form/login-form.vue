<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <i-Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </i-Input>
    </FormItem>
    <FormItem prop="password">
      <i-Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </i-Input>
    </FormItem>
    <FormItem prop="captchaCode">
      <Row>
        <Col span="14">
          <i-Input v-model="form.captchaCode" placeholder="请输入验证码">
            <span slot="prepend">
              <Icon :size="14" type="ios-key"></Icon>
            </span>
          </i-Input>
        </Col>
        <Col span="10">
          <Captcha ref="captcha" v-model="form.generateKey" class="login-code-img" />
        </Col>
      </Row>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import Captcha from '_c/captcha'
export default {
  name: 'LoginForm',
  components: {
    Captcha
  },
  props: {
    usernameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    captchaRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data() {
    return {
      form: {
        username: null,
        password: null,
        generateKey: null,
        captchaCode: null
      },
      intervalTimer: null,
      captchaUrl: null
    }
  },
  computed: {
    rules() {
      return {
        username: this.usernameRules,
        password: this.passwordRules,
        captchaCode: this.captchaRules
      }
    }
  },
  created() {
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', this.form)
        }
      })
    },
    refreshCode() {
      this.$refs.captcha.refreshCode()
    }
  }
}
</script>
