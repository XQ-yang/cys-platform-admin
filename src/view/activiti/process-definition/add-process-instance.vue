<template>
<div>
  <Modal
    title="启动流程部署信息"
    v-model="visible"
    :loading="loading"
    @on-ok="submitHandle()"
    class-name="vertical-center-modal"
    :mask-closable="false">
    <Form ref="addForm" :model="dataForm" :rules="rules" :label-width="100">
    <Card dis-hover :bordered="false">
      <Row>
        <Col span="24">
          <Form-item label="实例名称" prop="instanceName">
            <Input type="text" v-model="dataForm.instanceName" :maxlength="20" placeholder="请填写实例名称"></Input>
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Form-item label="实例描述" prop="instanceDescription">
            <Input type="textarea" :autosize="{minRows: 2, maxRows: 4}" v-model="dataForm.instanceDescription" :maxlength="200" placeholder="请填写实例描述"></Input>
          </Form-item>
        </Col>
      </Row>
    </Card>
  </Form>
 </Modal>
</div>
</template>
<script>
import { startProcessInstance } from '@/api/activiti'
export default {
  name: 'AddProcessInstance',
  data() {
    return {
      visible: false,
      loading: true,
      dataFormSrc: {
        definitionKey: null,
        instanceName: null,
        instanceDescription: null
      },
      dataForm: {},
      rules: {
        instanceName: [
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
  methods: {
    showModal(row) {
      this.$refs['addForm'].resetFields()
      this.dataForm = {
        definitionKey: row.key,
        instanceName: null,
        instanceDescription: null
      }
      this.visible = true
    },
    // 页面初始化
    init() {
      this.$refs['addForm'].resetFields()
      this.visible = true
    },
    // 提交表单
    submitHandle() {
      this.$refs['addForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        startProcessInstance(this.dataForm).then(res => {
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
