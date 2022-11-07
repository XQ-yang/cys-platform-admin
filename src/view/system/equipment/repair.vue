<template>
  <div>
    <Modal
      v-model="visible"
      title="维修记录"
      :loading="loading"
      @on-ok="dataFormSubmitHandle()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="600"
    >
      <Form ref="repairForm" :model="RepairRecord" :rules="rules" style="padding-right:20px;" :label-width="100">
        <Form-item label="维修内容" prop="repairContent">
          <Input
v-model="RepairRecord.repairContent"
type="textarea"
:autosize="{minRows: 2,maxRows: 5}"
                 placeholder="输入设备维修内容..."></Input>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { updateUseStatusForRepairOrRecipients } from '@/api/equipment'

export default {
  data() {
    return {
      popVisible: false,
      orgVisible: false,
      visible: false,
      loading: true,
      id: null,
      dataForm: {},
      RepairRecord: {
        id: null,
        equId: null,
        repairContent: '',
        recordTime: null
      },
      rules: {
        repairContent: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['repairForm'].resetFields()
      })
    },

    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

    dataFormSubmitHandle() {
      this.$refs['repairForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 后台接口，创建维修记录并更新使用状态
        this.dataForm['repairRecord'] = this.RepairRecord
        updateUseStatusForRepairOrRecipients(this.dataForm, this.id, 3).then(res => {
          this.changeLoading()
          this.visible = false
          // 触发刷新列表事件
          this.$emit('refreshDataList')
          this.$Message.success(res.msg)
          this.dataForm = {}
        }).catch(error => {
          this.$Message.error(error.msg)
          this.loading = false
          this.dataForm = {}
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
