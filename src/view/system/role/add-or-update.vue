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
        roleName: '', // 角色名称
        version: '1'
      },
      rules: {
        roleName: [
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
          debugger
          this.changeLoading()
          this.visible = false
          // 触发刷新列表事件
          this.$emit('refreshDataList')
          this.$Message.success(res.msg)
        }).catch(error => {
          debugger
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

