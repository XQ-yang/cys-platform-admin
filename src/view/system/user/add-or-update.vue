<template>
  <div>
    <Modal
      v-model="visible"
      :title="returnModalTitle"
      :loading="loading"
      @on-ok="onSubmit()"
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
        class="editForm"
      >
        <Row>
          <Col span="12">
            <Form-item label="用户名" prop="username">
              <Input
                type="text"
                v-model="dataForm.username"
                :maxlength="10"
                :disabled="userVisible"
              ></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="手机号码" prop="mobile">
              <Input type="text" v-model="dataForm.mobile" :maxlength="11" placeholder="请输入11位的手机号"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="组织" prop="orgName">
              <Poptip trigger="click" v-model="popOrgVisible" placement="bottom-start">
                <Input type="text" v-model="dataForm.orgName" :readonly="true" :maxlength="20"></Input>
                <div slot="content">
                  <Tree :data="orgData" :multiple="false" @on-select-change="selectOrg"></Tree>
                </div>
              </Poptip>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="部门" prop="deptName ">
              <Poptip trigger="click" v-model="popDeptVisible" placement="bottom-start">
                <Input type="text" v-model="dataForm.deptName" :readonly="true" :maxlength="20"></Input>
                <div slot="content">
                  <Tree :data="deptData" :multiple="false" @on-select-change="selectDept"></Tree>
                </div>
              </Poptip>
            </Form-item>
          </Col>
        </Row>
        <Row>

          <Col span="12">
            <Form-item label="角色" prop="roleId">
              <Select
                v-model="dataForm.roleId"
                multiple
                filterable
                placeholder="请选择"
              >
                <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="是否启用" prop="status">
              <Select v-model="dataForm.status" clearable placeholder="请选择">
                <Option :value="1">启用</Option>
                <Option :value="0">禁用</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="姓名" prop="realName">
              <Input type="text" v-model="dataForm.realName" :maxlength="10"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="性别">
              <RadioGroup v-model="dataForm.sex">
                <Radio :label="1">男</Radio>
                <Radio :label="2">女</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
        </Row>
        <Row>
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
import {
  fetchList as getOrgList,
  getDeptsByOrgId as getDeptList
} from '@/api/organization'
import { fetchList as getRoleList } from '@/api/role'
import { addOrUpdateUser, getUser } from '@/api/user'

export default {
  data() {
    return {
      modalTitle: '',
      popOrgVisible: false,
      popDeptVisible: false,
      popPositionVisible: false,
      visible: false,
      loading: true,
      userVisible: false,
      dataForm: {
        id: '',
        username: '',
        wxAccount: '',
        realName: '',
        email: '',
        mobile: '',
        avatar: '',
        sex: '',
        birthday: '',
        status: 1,
        orgId: '',
        orgName: '',
        deptId: '',
        deptName: '',
        roleId: '',
        positionId: '',
        positionName: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0,
        version: '1'
      },
      // 组织
      orgList: [],
      // 部门
      deptList: [],
      // 岗位
      positionList: [],
      // 角色
      roleList: [],
      rules: {
        username: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          {
            type: 'string',
            min: 5,
            message: '长度必须大于等于5',
            trigger: 'blur'
          }
        ],

        realName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        deptName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        positionName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        roleId: [
          { type: 'array', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        mobile: [
          {
            type: 'string',
            required: true,
            pattern: /^1[345789]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        email: [{ type: 'email', message: '邮箱格式错误', trigger: 'blur' }],
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
    },

    // 用于下拉框的数据源
    orgData() {
      return this.expandOrgTree(this.orgList)
    },
    deptData() {
      return this.expandDeptTree(this.deptList)
    },
    positionData() {
      return this.expandPositionTree(this.positionList)
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['userForm'].resetFields()
        getRoleList().then(res => {
          this.roleList = res.data.records
        })
        getOrgList().then(res => {
          this.orgList = res.data
          if (this.dataForm.id !== '' && this.dataForm.id !== undefined) {
            this.userVisible = true
            getUser(this.dataForm.id).then(res => {
              this.dataForm = {
                ...this.dataForm,
                ...res.data
              }
            })
          }
        })
      })
    },

    // 重置下拉选框的选中项
    resetDept() {
      this.dataForm.deptId = ''
      this.dataForm.deptName = ''
    },
    // 响应下拉框change事件
    selectOrg(selectArray, item) {
      this.dataForm.orgId = item.id
      this.dataForm.orgName = item.title
      this.popOrgVisible = false
      this.resetDept()

      getDeptList(item.id)
        .then(res => {
          this.deptList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    selectDept(selectArray, item) {
      this.dataForm.deptId = item.id
      this.dataForm.deptName = item.title
      this.popDeptVisible = false
    },

    // list数据转成tree形的数据结构
    expandOrgTree(treeData) {
      return treeData.map(item => {
        item.title = item.orgName
        if (item.children && item.children.length) {
          item.children = this.expandOrgTree(item.children)
        }
        return item
      })
    },
    expandDeptTree(treeData) {
      return treeData.map(item => {
        item.title = item.deptName
        if (item.children && item.children.length) {
          item.children = this.expandDeptTree(item.children)
        }
        return item
      })
    },
    expandPositionTree(treeData) {
      return treeData.map(item => {
        item.title = item.name
        if (item.children && item.children.length) {
          item.children = this.expandPositionTree(item.children)
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
    onSubmit() {
      this.$refs['userForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.dataForm.birthday = new Date(this.dataForm.birthday)
        addOrUpdateUser(this.dataForm)
          .then(res => {
            this.changeLoading()
            this.visible = false
            // 触发刷新列表事件
            this.$emit('refreshDataList')
            this.$Message.success(res.msg)
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
