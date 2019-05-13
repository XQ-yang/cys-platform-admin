<template>
  <div>
    <Card>
      <p slot="title">
      <Icon type="md-card" />
       个人中心
      </p>
      <a href="#" slot="extra" @click.prevent="changeLimit">
            <Icon type="ios-loop-strong"></Icon>
            修改密码
      </a>
       <Form ref="userForm" :model="userTemp"  :label-width="90" style="padding-right:20px;">
          <Row>
            <Col span="12">
              <Form-item label="账号">
                <Input type="text" v-model="userTemp.username" disabled></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="姓名">
                <Input type="text" v-model="userTemp.realName" disabled></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="公司">
                 <Input type="text" v-model="userTemp.companyName" disabled></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="部门" >
                <Input type="text" v-model="userTemp.departmentName" disabled></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="岗位">
                 <Input type="text" v-model="userTemp.postionName" disabled></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="角色">
                <Input type="text" v-model="userTemp.roleName" disabled></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="性别">
                <RadioGroup v-model="userTemp.sex">
                  <Radio  :label="0" disabled>未知</Radio>
                  <Radio  :label="1" disabled>男</Radio>
                  <Radio  :label="2" disabled>女</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="生日">
                <DatePicker type="date" placeholder="选择日期" v-model="userTemp.birthday" disabled></DatePicker>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="手机">
                <Input type="text" v-model="userTemp.mobile" disabled></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="微信">
                <Input type="text" v-model="userTemp.wxAccount" disabled></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="邮箱">
                <Input type="text" v-model="userTemp.email" disabled></Input>
              </Form-item>
            </Col>
          </Row>
        </Form>
    </Card>
    <Modal
    v-model="editPasswordMoadl"
    :closable='false'
    :mask-closable=false
    :width="500"
    class-name="vertical-center-modal"
    ok-text="提交"
    cancel-text="关闭"
    title="修改密码"
    @on-ok="edit"
    :loading="loading"
    >
      <Form ref="editPasswordForm" :model="editPasswordForm" :rules="rules" :label-width="90">
        <FormItem label="原密码" prop="password">
           <Input type="password" v-model="editPasswordForm.password" :maxlength="16" placeholder="请输入现在使用的密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
           <Input type="password" v-model="editPasswordForm.newPassword" :maxlength="16" placeholder="请输入新密码，至少6位字符"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="rePassword">
           <Input type="password" v-model="editPasswordForm.rePassword" :maxlength="16" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { getUserInfo, editPassword } from '@/api/user'
export default {
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      userTemp: {
        id: undefined,
        username: '',
        password: '',
        wxAccount: '',
        realName: '',
        email: '',
        mobile: '',
        avatar: '',
        sex: '',
        birthday: '',
        status: 0,
        departmentId: '',
        companyId: '',
        organizationId: '',
        roleId: [],
        postionId: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0,
        companyName: '',
        departmentName: '',
        postionName: '',
        roleName: ''

      },
      editPasswordForm: {
        id: undefined,
        password: '',
        newPassword: '',
        rePassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 16, message: '最多输入16个字符', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: valideRePassword, trigger: 'blur' }
        ]
      },
      editPasswordMoadl: false
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getUserInfo().then(res => {
        this.userTemp = Object.assign({}, res.data)
      })
    },
    changeLimit() {
      this.editPasswordForm.id = this.userTemp.id
      this.editPasswordMoadl = true
    },
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    edit() {
      this.$refs['editPasswordForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editPassword(this.editPasswordForm).then(res => {
          this.editPasswordMoadl = false
          this.$Message.success(res.msg)
        }).catch(error => {
          this.editPasswordMoadl = true
          this.$Message.error(error.msg)
        })
        this.changeLoading()
      })
    }
  }
}
</script>
