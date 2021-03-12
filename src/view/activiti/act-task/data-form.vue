<template>
<div>
  <Modal
    :title="formInfo.formName"
    v-model="visible"
    :loading="loading"
    ok-text="提交"
    @on-ok="submitHandle()"
    class-name="vertical-center-modal"
    :mask-closable="false">
    <Card dis-hover :bordered="false">
      <Form
        ref="dataForm"
        :model="dataForm"
        :label-width="labelWidth">
        <Row
          v-if="formInfo.formDataItemList && formInfo.formDataItemList.length"
          v-for="(item, index) in formInfo.formDataItemList"
          :key="index">
          <Col span="24">
            <FormItem
            :label="item.controlName"
            :rules="{required: item.isRequired, message: item.controlName + '不能为空', trigger: 'blur'}"
            :prop="item.controlId">
              <Input v-if="item.controlType === 'input'" type="text" v-model="dataForm[item.controlId]" :maxlength="30" :placeholder="item.placeHolder"></Input>
              <Input v-else-if="item.controlType === 'text-area'" type="textarea" :autosize="{minRows: 2, maxRows: 4}" v-model="dataForm[item.controlId]" :placeholder="item.placeHolder" :maxlength="1000"></Input>
              <DatePicker v-else-if="item.controlType === 'date-picker'" v-model="dataForm[item.controlId]" type="date" style="width: 100%;" :placeholder="item.placeHolder"></DatePicker>
              <RadioGroup v-else-if="item.controlType === 'radio'" v-model="dataForm[item.controlId]">
                <Radio v-for="innerItem in JSON.parse(item.optionalVal)" :label="innerItem.value" :key="innerItem.value">{{innerItem.label}}</Radio>
              </RadioGroup>
              <Select v-else-if="item.controlType === 'select'" v-model="dataForm[item.controlId]">
                <Option v-for="innerItem in JSON.parse(item.optionalVal)" :value="innerItem.value" :key="innerItem.value">{{ innerItem.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  </Modal>
</div>
</template>
<script>
import { getFormData, saveFormData } from '@/api/activiti'
export default {
  name: 'DataForm',
  props: {
    taskId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      labelWidth: 80,
      loading: true,
      formInfo: {},
      dataForm: {},
      rules: {
        taskId: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  watch: {
    // taskId: {
    //   immediate: true,
    //   handler(value) {
    //     if (value) {
    //       this.taskId = value
    //       getFormData(this.taskId).then(res => {
    //         if (res && res.data) {
    //           this.formInfo = res.data
    //         }
    //       }).catch(error => {
    //         this.$Message.error(error.msg)
    //       })
    //     }
    //   }
    // }
  },
  methods: {
    showModal(taskId) {
      this.init(taskId)
    },
    // 页面初始化
    init(taskId) {
      this.$refs['dataForm'].resetFields()
      if (taskId) {
        getFormData(taskId).then(res => {
          if (res && res.data) {
            this.formInfo = res.data
          }
          this.visible = true
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }
    },
    // 提交表单
    submitHandle() {
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        let data = {
          taskId: this.formInfo.taskId,
          procDefId: this.formInfo.procDefId,
          businessKey: this.formInfo.businessKey,
          formId: this.formInfo.formId,
          formKey: this.formInfo.formKey
        }
        if (this.formInfo.formDataItemList && this.formInfo.formDataItemList.length) {
          let itemList = this.formInfo.formDataItemList.map(item => {
            return {
              controlId: item.controlId,
              userVal: this.dataForm[item.controlId]
            }
          })
          data.itemList = itemList
        }
        saveFormData(data).then(res => {
          this.changeLoading()
          this.visible = false
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.visible = true
          this.$Message.error(error.msg)
        })
      })
    },
    // 按钮加载
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    }
  }
}
</script>
