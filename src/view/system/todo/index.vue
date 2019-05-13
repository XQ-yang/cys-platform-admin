<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="事项名称" class="search-input" v-model="listQuery.workName"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'addTodo'}" @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
            <Button  v-permission="{rule:'editTodo'}" type="primary" size="small" style="margin: 5px" @click="handleUpdate(row)">编辑</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button v-permission="{rule:'delTodo'}" type="error" size="small">删除</Button>
            </Poptip>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-change="getList"
            show-total
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
      <!--弹出层-->
      <Modal
      v-model="dialogFormVisible"
      :title="textMap[dialogStatus]"
      :loading="loading"
      @on-ok="dialogStatus==='create'?createData():updateData()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="700"
      ok-text="提交"
      cancel-text="关闭"
      >
        <Form ref="todoForm" :model="todoSetTemp" :rules="rules" :label-width="90" style="padding-right:20px;">
          <Row>
            <Col span="12">
              <Form-item label="事项名称" prop="workName">
                <Input type="text" v-model="todoSetTemp.workName" :maxlength="10"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="通知渠道" prop="informType">
                <Select v-model="todoSetTemp.informType" clearable placeholder="请选择">
                  <Option :value="1">系统提醒</Option>
                  <Option :value="2">邮件</Option>
                  <Option :value="3">短信</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="起始日期" prop="startDate">
                <DatePicker type="date" placeholder="选择日期" v-model="todoSetTemp.startDate"  style="width:100%" ></DatePicker>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="结束日期" prop="endDate">
                <DatePicker type="date" placeholder="选择日期"  v-model="todoSetTemp.endDate"   style="width:100%" ></DatePicker>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="来源" prop="fromModule">
                <Select v-model="todoSetTemp.fromModule" clearable placeholder="请选择">
                  <Option :value="1">定期检测报告</Option>
                  <Option :value="2">巡检报告</Option>
                  <Option :value="3">其它</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="优先级" prop="workPriority">
                <Select v-model="todoSetTemp.workPriority" clearable placeholder="请选择">
                  <Option :value="1">一般</Option>
                  <Option :value="2">紧急</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="通知角色" prop="groupId">
                <Select v-model="todoSetTemp.groupId"  clearable placeholder="请选择">
                  <Option v-for="item in roleList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="流程名">
                <Input type="text"  v-model="todoSetTemp.workflowName" :maxlength="10"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="简要内容">
                <Input type="textarea" :rows="4"  v-model="todoSetTemp.workContent" :maxlength="200"></Input>
              </Form-item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { getRoleData } from '@/api/role'
import { fetchList, addTodoSet, deleteTodoSet, editTodoSet, getTodoSetById } from '@/api/todo'
export default {
  name: 'todo',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '事项', key: 'workName' },
        { title: '简要内容', key: 'workContent' },
        { title: '开始日期',
          key: 'startDate',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.startDate, 'yyyy-MM-dd')
            )
          }
        },
        { title: '结束日期',
          key: 'endDate',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.endDate, 'yyyy-MM-dd')
            )
          }
        },
        { title: '创建时间',
          key: 'createTime',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '创建人', key: 'createBy' },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      tableLoading: false,
      loading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        workName: ''
      },
      todoSetTemp: {
        id: undefined,
        workerId: '',
        workName: '',
        workContent: '',
        startDate: '',
        endDate: '',
        workflowNameKey: '',
        workflowName: '',
        workPriority: '',
        informType: '',
        fromModule: '',
        status: 0,
        groupId: '',
        createBy: ''
      },
      rules: {
        workName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        informType: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        startDate: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        endDate: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        fromModule: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        workPriority: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ]
      },
      roleList: [],
      isFirstEnter: true
    }
  },
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {
    if (this.isFirstEnter) {
      // 获取列表数据
      this.getList()
      this.getRole()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取列表数据
      this.getList()
      this.getRole()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getRole() {
      getRoleData().then(res => {
        this.roleList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 重置表单页面赋值
    resetTodoSetTemp() {
      this.todoSetTemp = {
        id: undefined,
        workerId: '',
        workName: '',
        workContent: '',
        startDate: '',
        endDate: '',
        workflowNameKey: '',
        workflowName: '',
        workPriority: '',
        informType: '',
        fromModule: '',
        status: 0,
        groupId: '',
        createBy: ''
      }
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetTodoSetTemp()
      this.$refs['todoForm'].resetFields()
    },
    createData() {
      this.$refs['todoForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.todoSetTemp.createBy = this.$store.state.user.userName
        addTodoSet(this.todoSetTemp).then(res => {
          this.dialogFormVisible = false
          this.changeLoading()
          this.$Message.success(res.msg)
          this.getList()
        }).catch(error => {
          this.changeLoading()
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    getTodoModelById(id) {
      getTodoSetById(id).then(res => {
        this.todoSetTemp = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleUpdate(row) {
      this.getTodoModelById(row.id)
      this.dialogStatus = 'update'
      this.$refs['todoForm'].resetFields()
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['todoForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editTodoSet(this.todoSetTemp).then(res => {
          this.changeLoading()
          this.dialogFormVisible = false
          this.getList()
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    handleDelete(id) {
      deleteTodoSet(id).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    },
    getDateTime(val) {
      this.todoSetTemp.startDate = val
    }
  }
}
</script>
