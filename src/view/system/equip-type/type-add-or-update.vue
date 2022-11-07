<template>
  <div>
    <Modal
      v-model="visible"
      :title="returnModalTitle"
      :loading="loading"
      @on-ok="dataFormSubmitHandle()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="500"
      class="editForm"
    >
      <Form ref="equipTypeForm" :model="dataForm" :rules="rules" :label-width="100">
        <Form-item label="类型名称" prop="typeName">
          <Input type="text" v-model="dataForm.typeName" :maxlength="20"></Input>
        </Form-item>
        <Form-item label="排序" prop="sort">
          <Input v-model="dataForm.sort" type="number" :maxlength="6"></Input>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { addOrUpdateEquipType, getEquipTypeInfo } from '@/api/equip-type'

export default {
  data() {
    return {
      modalTitle: '',
      popVisible: false,
      orgVisible: false,
      visible: false,
      loading: true,
      dataForm: {
        id: '', // 主键
        typeName: '', // 类型名称
        sort: null, // 排序
        status: null, // 状态
        version: '1'
      },
      selectData: [],
      selectOrgData: [],
      rules: {
        typeName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
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
        this.$refs['equipTypeForm'].resetFields()
        if (this.dataForm.id) {
          this.typeVisible = true
          this.getInfo()
        } else {
          this.typeVisible = false
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
      getEquipTypeInfo(this.dataForm.id).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      })
    },

    dataFormSubmitHandle() {
      this.$refs['equipTypeForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addOrUpdateEquipType(this.dataForm).then(res => {
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

<style scoped>

</style>
