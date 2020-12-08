<template>
  <div>
      <Modal
      v-model="visible"
      :title="returnModalTitle"
      :loading="loading"
      @on-ok="dataFormSubmitHandle()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="460"
      class="editForm"
      >
        <Form ref="roleForm" :model="dataForm" :rules="rules" :label-width="100">
          <Form-item label="角色名称" prop="roleName">
            <Input v-model="dataForm.roleName" type="text"  :maxlength="20"></Input>
          </Form-item>
          <Form-item label="数据权限" prop="dataType">
            <Select v-model="dataForm.dataType" clearable placeholder="请选择">
              <Option :value="1">仅本人数据</Option>
              <Option :value="2">所在部门数据</Option>
              <Option :value="3">所在部门及下属部门数据</Option>
              <Option :value="4">所在公司数据</Option>
              <Option :value="5">所在公司及下属公司数据</Option>
            </Select>
          </Form-item>
        </Form>
      </Modal>
  </div>
</template>

<script>
import { addOrUpdateRole, getRoleInfo } from '@/api/role'

export default {
  data() {
    return {
      modalTitle: '',
      visible: false, // 控制弹出框显示与否
      loading: true, // 提交确认按钮控制
      dataForm: {
        id: '', // 主键
        dataType: null,
        roleName: '', // 角色名称
        version: '1'
      },
      rules: {
        roleName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        dataType: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
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
        this.$refs['roleForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },

    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getInfo() {
      getRoleInfo(this.dataForm.id).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      })
    },
    dataFormSubmitHandle() {
      this.$refs['roleForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addOrUpdateRole(this.dataForm).then(res => {
          this.changeLoading()
          this.visible = false
          // 触发刷新列表事件
          this.$emit('refreshDataList')
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.visible = true
          this.$Message.error(error.msg)
        })
      })
    }
  }
}
</script>
