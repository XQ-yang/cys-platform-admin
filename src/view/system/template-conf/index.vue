<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear" clearable placeholder="流程状态" class="search-input" v-model="listQuery.processStatusText"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe></Table>
      <!--新增编辑弹出层-->
      <Modal
      v-model="dialogFormVisible"
      title="编辑模板信息配置"
      :loading="loading"
      @on-ok="updateData()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="500"
      ok-text="提交"
      cancel-text="关闭">
        <Form ref="confForm" :model="msgConf" :rules="rules" :label-width="110" style="padding-right:20px;">
          <Row>
            <Col span="24">
              <Form-item label="流程状态" prop="processStatusText">
                <Input type="text" v-model="msgConf.processStatusText" :maxlength="20" placeholder="请输入流程状态中文"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="是否异常流程">
                <RadioGroup v-model="msgConf.isExProcess">
                  <Radio disabled :label="0">否</Radio>
                  <Radio disabled :label="1">是</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="是否自动发送" prop="isAutoSend">
                <RadioGroup v-model="msgConf.isAutoSend">
                  <Radio :disabled="msgConf.processStatusValue >= 8" :label="0">否</Radio>
                  <Radio :disabled="msgConf.processStatusValue >= 8" :label="1">是</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="跳转详情地址" prop="detailUrl">
                <Input type="text" v-model="msgConf.detailUrl" :maxlength="255" placeholder="请输入跳转详情地址"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="模板信息备注" prop="templateRemark">
                <Input v-model="msgConf.templateRemark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" :maxlength="255" placeholder="请输入模板信息备注"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { getConfList, autoSendChange, getConfById, confUpdate } from '@/api/templateMsg'
export default {
  name: 'templateConf',
  filters: {
    exProcessFilter(isExProcess) {
      const exProcessMap = ['否', '是']
      return exProcessMap[isExProcess]
    }
  },
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 70,
          type: 'index'
        },
        { title: '流程状态', width: 170, key: 'processStatusText', tooltip: true },
        {
          title: '异常流程',
          key: 'isExProcess',
          width: 100,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.exProcessFilter(row.isExProcess)
            return h(
              'div',
              text
            )
          }
        },
        { title: '跳转详情地址', key: 'detailUrl', tooltip: true },
        { title: '模板信息备注', key: 'templateRemark', tooltip: true },
        { title: '是否自动发送',
          key: 'isAutoSend',
          align: 'center',
          width: 130,
          render: (h, params, vm) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.isAutoSend,
                  'true-value': 1,
                  'false-value': 0,
                  disabled: params.row.processStatusValue >= 8,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '开启'),
                  close: () => h('span', '关闭')
                },
                on: {
                  'on-change': () => {
                    this.handleAutoSendChange(params.row)
                  }
                }
              }, '编辑')
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '3px 2px 2px 3px'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'templateConfUpdate' }
                  }
                ],
                on: {
                  click: () => {
                    this.handleUpdate(params.row)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      total: 0,
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      tableLoading: false,
      loading: true,
      listQuery: {
        processStatusText: ''
      },
      msgConf: {
      },
      rules: {
        processStatusText: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        isAutoSend: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        detailUrl: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          { type: 'url', message: 'url格式错误', trigger: 'blur' }
        ]
      },
      isFirstEnter: true
    }
  },
  created() {

  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取列表数据
      this.getList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取列表数据
      this.getList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      getConfList(this.listQuery).then(res => {
        this.list = res.data
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 重置表单页面赋值
    resetUserTemp() {

    },
    handleSearch() {
      this.getList()
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    handleAutoSendChange(row) {
      autoSendChange({ id: row.id, isAutoSend: row.isAutoSend === 0 ? 1 : 0 }).then(res => {
        this.$Message.success(res.msg)
      }).catch(error => {
        this.$Message.error(error.msg)
        this.getList()
      })
    },
    handleUpdate(row) {
      getConfById(row.id).then(res => {
        this.msgConf = res.data
        this.$refs['confForm'].resetFields()
        this.dialogFormVisible = true
      }).catch(error => {
        this.$Message.error(error.msg)
        this.getList()
      })
    },
    updateData() {
      this.$refs['confForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        confUpdate(this.msgConf).then(res => {
          this.changeLoading()
          this.dialogFormVisible = false
          this.$Message.success(res.msg)
          this.getList()
        }).catch(error => {
          this.changeLoading()
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    }

  }
}
</script>
<style scoped>

</style>
