<template>
  <div>
    <Modal
      v-model="visible"
      :title="returnModalTitle"
      :loading="loading"
      @on-ok="dataFormSubmitHandle()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="960"
    >
      <Form
        ref="userForm"
        :model="dataForm"
        :rules="rules"
        :label-width="90"
        style="padding-right:20px;"
      >
        <Row>
          <Col span="12">
            <Form-item label="账号" prop="username">
              <Input type="text" v-model="dataForm.username" :maxlength="10"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="密码" prop="password">
              <Input type="password" v-model="dataForm.password" :maxlength="16"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Form-item label="角色" prop="roleId">
              <Poptip trigger="click" v-model="popVisible" placement="bottom-start">
                <Input type="text" v-model="dataForm.roleName" :readonly="true" :maxlength="20"></Input>
                <div slot="content">
                  <Tree
                    :data="selectData"
                    :multiple="false"
                    @on-select-change="handleTreeSelectChange"
                  ></Tree>
                </div>
              </Poptip>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="是否启用" prop="status">
              <Select v-model="dataForm.status" clearable placeholder="请选择">
                <Option :value="0">启用</Option>
                <Option :value="1">禁用</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="姓名" prop="realName">
              <Input type="text" v-model="dataForm.realName" :maxlength="10"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="性别">
              <RadioGroup v-model="dataForm.sex">
                <Radio :label="0">未知</Radio>
                <Radio :label="1">男</Radio>
                <Radio :label="2">女</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="出生日期" prop="birthday">
              <DatePicker
                type="date"
                placeholder="选择日期"
                :value="dataForm.birthday"
                @on-change="dataForm.birthday=$event"
                style="width:100%"
              ></DatePicker>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="手机号" prop="mobile">
              <Input type="text" v-model="dataForm.mobile" :maxlength="11" placeholder="请输入11位的手机号"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="微信">
              <Input type="text" v-model="dataForm.wxAccount" :maxlength="20"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="邮箱" prop="email">
              <Input type="text" v-model="dataForm.email" :maxlength="20"></Input>
            </Form-item>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { fetchList as getDeptList } from '@/api/dept'
import { fetchList as getRoleList } from '@/api/role'
import { fetchList as getPositionList } from '@/api/postion'
import { addOrUpdateUser, getUser } from '@/api/user'

export default {
  data() {
    return {
      modalTitle: '',
      popVisible: false,
      typeVisible: false,
      treeSelected: '',
      visible: false,
      loading: true,
      dataForm: {
        id: '',
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
        orgId: '',
        deptId: '',
        roleId: '',
        positionId: '',
        roleName: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0
      },
      // 组织
      orgList: [],
      // 部门
      departmentList: [],
      // 岗位
      positionList: [],
      // 角色
      roleList: [],
      selectData: [],
      rules: {
        username: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '长度必须大于等于6',
            trigger: 'blur'
          }
        ],

        realName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        mobile: [
          {
            type: 'string',
            required: true,
            pattern: /^1[34578]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        email: [{ type: 'email', message: '邮箱格式错误', trigger: 'blur' }],
        password: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '长度必须大于等于6',
            trigger: 'blur'
          }
        ],
        status: [
          {
            type: 'number',
            required: true,
            message: '必填项，不能为空',
            trigger: 'change'
          }
        ],
        birthday: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    returnModalTitle() {
      if (!this.dataForm.id) {
        return '新增'
      } else {
        return '编辑'
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['userForm'].resetFields()
        this.getRoles().then(() => {
          if (this.dataForm.id) {
            this.typeVisible = true
            this.getInfo()
          } else {
            this.typeVisible = false
          }
        })
      })
    },
    // select选择项改变触发事件
    selectOrg(val) {
      if (val) {
        getDeptList(val)
          .then(res => {
            this.departmentList = res.data
          })
          .catch(error => {
            this.$Message.error(error.msg)
          })
      }
    },
    selectDept(val) {
      if (val) {
        getPositionList(val)
          .then(res => {
            this.positionList = res.data.records
          })
          .catch(error => {
            this.$Message.error(error.msg)
          })
      }
    },
    selectPosition(val) {
      if (val) {
        getRoleList(val)
          .then(res => {
            this.RoleList = res.data.records
          })
          .catch(error => {
            this.$Message.error(error.msg)
          })
      }
    },
    // 绑定父级菜单选中值
    handleTreeSelectChange(selectArray, item) {
      this.dataForm.roleId = item.id
      this.dataForm.roleName = item.title
      this.popVisible = false
    },
    getRoles() {
      return getRoleList().then(res => {
        this.selectData = this.expandDeptTree(res.data.records)
      })
    },
    // 把数据转换为tree组件的对应格式
    expandDeptTree(treeData) {
      return treeData.map(item => {
        item.title = item.roleName
        if (item.children && item.children.length) {
          item.children = this.expandDeptTree(item.children)
        }
        return item
      })
    },
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getInfo() {
      // getOrgList()
      //   .then(res => {
      //     this.orgList = res.data
      //   })
      //   .catch(error => {
      //     this.$Message.error(error.msg)
      //   })
      // getDeptList(this.dataForm.orgId)
      //   .then(res => {
      //     this.departmentList = res.data
      //   })
      //   .catch(error => {
      //     this.$Message.error(error.msg)
      //   })
      // getPositionList()
      //   .then(res => {
      //     this.positionList = res.data.records
      //   })
      //   .catch(error => {
      //     this.$Message.error(error.msg)
      //   })
      getUser(this.dataForm.id).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      })
    },
    dataFormSubmitHandle() {
      this.$refs['userForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addOrUpdateUser(this.dataForm)
          .then(res => {
            this.changeLoading()
            this.visible = false
            // 触发刷新列表事件
            this.$emit('refreshDataList')
            this.$Message.success('新增成功')
          })
          .catch(error => {
            this.changeLoading()
            this.visible = true
            this.$Message.error(error.msg)
          })
      })
    }
  }
}
</script>
<style>
</style>
