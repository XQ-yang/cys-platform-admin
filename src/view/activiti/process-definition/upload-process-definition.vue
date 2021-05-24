<template>
<div>
  <Modal
    title="上传部署流程"
    v-model="visible"
    :loading="loading"
    @on-ok="submitHandle()"
    class-name="vertical-center-modal"
    :mask-closable="false">
    <Form ref="addForm" :model="dataForm" :rules="rules" :label-width="110">
    <Card dis-hover :bordered="false">
      <Row>
        <Col span="24">
          <Form-item label="流程文件" prop="uploadList">
            <file-upload
              v-model="dataForm.uploadList"
              :defaultFileList="defaultFileList"
              :storeType="1"
              :count="1"
              :format="['bpmn', 'zip']"
              accept=".bpmn, .zip" >
              <div slot="tip" class="tip-style">注意: 最大20M, 必须为bpmn或zip格式</div>
            </file-upload>
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Form-item label="流程定义名称" prop="processDefinitionName">
            <Input type="text" v-model="dataForm.processDefinitionName" :maxlength="20" placeholder="请填写流程定义名称"></Input>
          </Form-item>
        </Col>
      </Row>
    </Card>
  </Form>
 </Modal>
</div>
</template>
<script>
import { deployProcessDefinition } from '@/api/activiti'
import FileUpload from '_c/upload'
export default {
  name: 'UploadProcessDefinition',
  components: {
    FileUpload
  },
  data() {
    return {
      visible: false,
      loading: true,
      dataFormSrc: {
        processDefinitionName: null,
        uploadList: [],
        mediaId: null
      },
      dataForm: {},
      rules: {
        uploadList: [
          { type: 'array', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        processDefinitionName: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      },
      defaultFileList: []
    }
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
        mediaId: null,
        processDefinitionName: null,
        uploadList: []
      }
      this.defaultFileList = []
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
        this.dataForm.mediaId = this.dataForm.uploadList.map(file => file.id).join(',')
        deployProcessDefinition(this.dataForm).then(res => {
          this.changeLoading()
          this.visible = false
          this.$emit('refreshList')
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
<style scoped>
.tip-style {
  color: red;
  font-size: 12px;
}
</style>
